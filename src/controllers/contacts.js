import {
  getContactById,
  getContacts,
  createContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

/* get all contacts */

export const getContactsController = async (req, res) => {
  const data = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

/* get contact by id */

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  console.log(contactId);

  const data = await getContactById(contactId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
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
