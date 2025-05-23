import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constans/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDocs = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDocs)];
  } catch (err) {
    console.log('Swagger out:', err.message);
    return (req, res, next) => {
      next(createHttpError(500, "Can't load swagger docs"));
    };
  }
};
