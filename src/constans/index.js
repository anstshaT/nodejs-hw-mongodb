import path from 'node:path';

export const sortList = ['asc', 'desc'];

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd());
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
