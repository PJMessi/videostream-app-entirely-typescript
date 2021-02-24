import { PaginationHelpers } from '@root/types/pagination';

export const DefaultLimit = 10;
export const DefaultPage = 1;
export const DefaultSortOrder = 'DESC';

export const calculateOffset = (page: number, limit: number): number => {
  return limit * (page - 1);
};

export const generatePaginationHelpers = (
  limit: number,
  page: number,
  total: number
): PaginationHelpers => {
  const currentPage = page;
  const lastPage = Math.ceil(total / limit);
  const perPage = limit;

  let from: null | number = (currentPage - 1) * limit + 1;
  let to: null | number = currentPage * limit;

  if (to > total) to = total;
  if (from > total) {
    from = null;
    to = null;
  }
  return {
    limit,
    page,
    lastPage,
    currentPage,
    from,
    perPage,
    to,
  };
};
