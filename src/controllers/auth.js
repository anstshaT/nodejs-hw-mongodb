import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  resetPassword,
  sendResetToken,
} from '../services/auth.js';
import setupSession from '../utils/setupSession.js';
import createHttpError from 'http-errors';

/* REGISTER */

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

/* LOGIN */

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

/* REFRESH */
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

/* LOGOUT */

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

/* SEND EMAIL*/

export const sendResetEmailController = async (req, res) => {
  const email = await sendResetToken(req.body.email);
  if (!email) {
    throw createHttpError(
      500,
      '"Failed to send the email, please try again later."',
    );
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

/* RESET PASSWORD */

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
