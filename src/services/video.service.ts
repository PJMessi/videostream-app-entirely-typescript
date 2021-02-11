import { Video } from "@models/video.model";
import { appendPaginationData, PaginationFilter, PaginationResult, refineFiltersForPagination } from "@helpers/pagination.helper";
import { saveVideoInLocalStorage } from '@helpers/videoupload.helper';

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
export const uploadVideo = async (attributes: {name: string, price: number}, videoFile: Express.Multer.File): 
Promise<Video> => {
    const { path, size } = await saveVideoInLocalStorage(videoFile);

    const video = await Video.create({ 
        name: attributes.name,
        price: attributes.price,
        path, size
     });

    return video;
}