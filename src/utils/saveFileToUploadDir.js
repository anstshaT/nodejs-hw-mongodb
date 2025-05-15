import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constans/index.js';
import { getEnvVar } from './getEnvVar.js';

const appDomain = getEnvVar('APP_DOMAIN');

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${appDomain}/uploads/${file.filename}`;
};
