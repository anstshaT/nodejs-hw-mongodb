import {
  getContactById,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactsSortField } from '../db/models/Contact.js';

/* get all contacts */

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactsSortField);

  const data = await getContacts({ ...paginationParams, ...sortParams });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

/* get contact by id */

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  console.log(contactId);

  const data = await getContactById(contactId);

  if (!data) {
    next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

/* create contact */

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

/* edit contact */

export const editContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

/* delete contact */

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
