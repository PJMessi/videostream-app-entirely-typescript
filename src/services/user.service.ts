import { User, UserAttributes, UserAttributesForUpdate } from '@models/user.model';
import { PaginationFilter, appendPaginationData, refineFilters, PaginationResult } from '@helpers/pagination.helper';
import { Transaction } from 'sequelize/types';
import bcrypt from 'bcrypt';

// Paginates the result according to the given filters.
export const paginate = async (
    filter: PaginationFilter = {}

): Promise<PaginationResult> => {

    const refinedFilter = refineFilters(filter);

    let { limit, page, offset, where, include, order } = refinedFilter;
    const videos = await User.findAndCountAll({ limit, offset, where, include, order });

    const paginationResult = appendPaginationData(videos, limit, page);

    return paginationResult;
}

// Fetches all the videos without pagination.
export const getAll = async (
    where?: object, 
    include?: string[]

): Promise<User[]> => {

    const videos = await User.findAll({ where, include });
    return videos;
}

// Fetches single user.
export const getOne = async (
    where?: object, 
    include?: string[]

): Promise<User|null> => {

    const user = await User.findOne({ where, include});
    return user;
}

// Fetch user by id.
export const getById = async (
    id: number,
    include?: string[]

): Promise<User|null> => {

    const user = await User.findByPk(id, {include});
    return user;
}

// Creates user from the given attributes.
export const create = async (
    attributes: UserAttributes,
    transaction?: Transaction

): Promise<User> => {

    // hashing password.
    attributes.password = await bcrypt.hash(attributes.password, 10);

    const user = await User.create(attributes, { transaction });
    return user;
}

// Updates the given attributes of the given user.
export const update = async (
    user: User,
    attributes: UserAttributesForUpdate,
    transaction?: Transaction

): Promise<User> => {

    // hasing password if password is to be updated.
    if (attributes.password) {
        attributes.password = await bcrypt.hash(attributes.password, 10);
    }

    return user.update(attributes, { transaction });
}

// Soft deletes the given user.
export const destroy = async (
    user: User,
    transaction?: Transaction

) => {

    await user.destroy({ transaction });
}

// Hard deletes the given user.
export const hardDestroy = async (
    user: User,
    transaction?: Transaction

) => {

    await user.destroy({ force: true, transaction });
}