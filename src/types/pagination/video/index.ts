export type VideoPaginationFilter = {
  limit?: number;
  page?: number;
  where?: VideoPaginationWhere;
  include?: string[];
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: VideoPaginationSort;
};

export type VideoPaginationWhere = {
  id?: string;
  name?: string;
  path?: string;
  size?: string;
  price?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type VideoPaginationSort =
  | 'id'
  | 'name'
  | 'path'
  | 'size'
  | 'price'
  | 'createdAt'
  | 'updatedAt';
