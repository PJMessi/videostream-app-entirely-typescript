import { Video, VideoAttributes, VideoAttributesForUpdate } from '@root/database/models/video.model';
import { PaginationFilter, appendPaginationData, refineFilters, PaginationResult } from '@helpers/pagination.helper';
import { Transaction } from 'sequelize/types';

// Paginates the result according to the given filters.
export const paginate = async (
    filter: PaginationFilter = {}

): Promise<PaginationResult> => {

    const refinedFilter = refineFilters(filter);

    let { limit, page, offset, where, include, order } = refinedFilter;
    const videos = await Video.findAndCountAll({ limit, offset, where, include, order });

    const paginationResult = appendPaginationData(videos, limit, page);

    return paginationResult;
}

// Fetches all the videos without pagination.
export const getAll = async (
    where?: object, 
    include?: string[]

): Promise<Video[]> => {

    const videos = await Video.findAll({ where, include });
    return videos;
}

// Fetches single video.
export const getOne = async (
    where?: object, 
    include?: string[]

): Promise<Video|null> => {

    const video = await Video.findOne({ where, include});
    return video;
}

// Fetch video by id.
export const getById = async (
    id: number,
    include?: string[]

): Promise<Video|null> => {

    const video = await Video.findByPk(id, {include});
    return video;
}

// Creates video from the given attributes.
export const create = async (
    attributes: VideoAttributes,
    transaction?: Transaction

): Promise<Video> => {

    const video = await Video.create(attributes, { transaction });
    return video;
}

// Updates the given attributes of the given video.
export const update = async (
    video: Video,
    attributes: VideoAttributesForUpdate,
    transaction?: Transaction

): Promise<Video> => {

    return video.update(attributes, { transaction });
}

// Soft deletes the given video.
export const destroy = async (
    video: Video,
    transaction?: Transaction

) => {

    await video.destroy({ transaction });
}

// Hard deletes the given video.
export const hardDestroy = async (
    video: Video,
    transaction?: Transaction

) => {

    await video.destroy({ force: true, transaction });
}