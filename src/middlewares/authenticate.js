import createHttpError from 'http-errors';
import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Authorization header not exist'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header is not type of Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const accessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (accessTokenExpired) {
    next(createHttpError(401, 'Access token is expired'));
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
