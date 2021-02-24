export type PaginationHelpers = {
  limit: number;
  page: number;
  lastPage: number;
  currentPage: number;
  from: number | null;
  perPage: number;
  to: number | null;
};

export type PaginationResult<T> = PaginationHelpers & {
  rows: T[];
  count: number;
};
