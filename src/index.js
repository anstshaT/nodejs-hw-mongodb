import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constans/index.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

bootstrap();
