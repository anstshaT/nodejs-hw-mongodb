import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use(router);

  /* 404 */
  app.use(notFoundHandler);

  /* 500 */
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
