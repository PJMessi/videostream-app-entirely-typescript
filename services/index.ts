import { Model } from "sequelize-typescript";
import { Transaction } from "sequelize";

export type PaginationFilter = {
    limit?: number, 
    page?: number, 
    where?: object, 
    include?: string[], 
    sortOrder?: 'ASC'|'DESC',
    sortBy?: string, 
    transaction?: Transaction 
}

export type RefinedPaginationFilter = {
    limit: number,
    page: number,
    offset: number,
    where: object
    include : string[] | [],
    order: [string, 'ASC'|'DESC'][],
    transaction?: Transaction
}

export type PaginationResult = {
    limit: number,
    page: number,
    rows: Model[],
    count: number,
    lastPage: number|null,
    currentPage: number,
    from: number|null,
    perPage: number, 
    to: number|null
}

export type SequelizeDataWithCount = {
    count: number, rows: Model[]
}

export const appendPaginationData = (
    dataWithCount: SequelizeDataWithCount, 
    limit: number, 
    page: number

): PaginationResult => {

    const total = dataWithCount.count
    const lastPage = Math.ceil(total/limit);
    const currentPage = page;
    let from: null|number = (currentPage-1) * limit + 1;
    const perPage = limit;
    let to: null|number = currentPage * limit;

    if (to > total) to = total;
    if (from > total) from = to = null;

    return { ...dataWithCount, limit, page, lastPage, currentPage, from, perPage, to };
}

export const refineFilters = (filter: PaginationFilter): RefinedPaginationFilter => {
        
    const limit = filter.limit || 10;
    const page = filter.page || 1;

    const offset = limit * (page - 1);
    const where = filter.where || {};
    const include = filter.include || [];

    const sortOrder = filter.sortOrder || 'DESC';
    const sortBy = filter.sortBy || 'id';
    
    const orderFormat1: [string, 'ASC'|'DESC'] = [sortBy, sortOrder];
    const order = [orderFormat1]

    const transaction = filter.transaction

    return { limit, page, offset, where, include, order, transaction };
}
