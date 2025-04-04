import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { getEnvVar } from './utils/getEnvVar.js';
import { getContactById, getContacts } from './services/contacts.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  /* Get all contacts */

  app.get('/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  });

  /* Get contacts by id */

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    console.log(contactId);

    const data = await getContactById(contactId);

    if (!data) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
    });
  });

  /* 404 */

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  /* 500 */

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: error.message,
    });
    next();
  });

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
