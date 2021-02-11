import { Video, VideoAttributes } from "@models/video.model";
import { appendPaginationData, PaginationFilter, PaginationResult, refineFiltersForPagination } from "@helpers/pagination.helper";

/**
 * Paginates videos based on given filters.
 * @param paginationFilter 
 */
export const paginateVideosForUsers = async (paginationFilter: PaginationFilter): 
Promise<PaginationResult> => {
    const {limit, page, offset, order} = refineFiltersForPagination(paginationFilter);

    const paginatedVideos = await Video.findAndCountAll({limit, offset, order});

    const paginatedResult = appendPaginationData(paginatedVideos, limit, page);

    return paginatedResult;
}

/**
 * Fetches video with given id.
 * @param id 
 */
export const fetchVideoById = async (id: number): Promise<Video|null> => {
    const video = await Video.findByPk(id);

    return video;
}

/**
 * Creates new video from given data.
 * @param attributes 
 */
export const createVideo = async (attributes: VideoAttributes): Promise<Video> => {
    const video = await Video.create(attributes);

    return video;
}