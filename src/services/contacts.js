import { sortList } from '../constans/index.js';
import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const data = await ContactCollection.find({ userId })
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactCollection.find({ userId }).countDocuments();
  const paginationData = await calcPaginationData({
    page,
    perPage,
    totalItems,
  });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = (id, userId) =>
  ContactCollection.findOne({ _id: id, userId });

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const result = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!result || !result.value) return null;

  return result.value;
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};
