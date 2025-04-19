export const calcPaginationData = ({ page, perPage, totalItems }) => {
  const totalPage = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPage;

  return {
    totalPage,
    hasPreviousPage,
    hasNextPage,
  };
};
