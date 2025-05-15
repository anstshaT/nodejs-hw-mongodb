import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import createSession from '../utils/createSession.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constans/index.js';

/* REGISTER */

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

/* LOGIN */

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Wrong password');

  await SessionCollection.deleteOne({ userId: user._id });

  const session = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

/* REFRESH */

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  const sessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (sessionTokenExpired)
    throw createHttpError(401, 'SessionToken is expired');

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

/* LOGOUT */

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

/* SEND EMAIL*/

export const sendResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const appDomain = getEnvVar('APP_DOMAIN');

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${appDomain}/auth/reset-password/?token=${resetToken}`,
  });

  const fromEmail = getEnvVar('SMTP_FROM');

  await sendEmail({
    from: fromEmail,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

/* RESET PASSWORD */

export const resetPassword = async ({ token, password }) => {
  const jwtSecret = getEnvVar('JWT_SECRET');

  let entries;
  try {
    entries = jwt.verify(token, jwtSecret);
  } catch (e) {
    if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw e.message;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UserCollection.updateOne(
    { _id: user.id },
    { password: encryptedPassword },
  );
};
