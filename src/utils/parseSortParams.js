import { sortList } from '../constans/index.js';
import { contactsSortField } from '../db/models/Contact.js';

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const parsedSortOrder = sortList.includes(sortOrder)
    ? sortOrder
    : sortList[0];

  const parsedSortBy = contactsSortField.includes(sortBy) ? sortBy : '_id';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
