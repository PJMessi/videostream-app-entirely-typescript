import { Video } from '@models/video.model';
import {
  appendPaginationData,
  PaginationFilter,
  PaginationResult,
  refineFiltersForPagination,
} from '@helpers/pagination.helper';
import { saveVideoInLocalStorage } from '@helpers/videoupload.helper';
import {
  determineStartAndEndBytes,
  VideoStreamData,
} from '@helpers/videoStream.helper';
import { promises as fs } from 'fs';

/**
 * Paginates videos based on given filters.
 * @param paginationFilter
 */
export const paginateVideosForUsers = async (
  paginationFilter: PaginationFilter
): Promise<PaginationResult> => {
  const { limit, page, offset, order } = refineFiltersForPagination(
    paginationFilter
  );

  const paginatedVideos = await Video.findAndCountAll({ limit, offset, order });

  const paginatedResult = appendPaginationData(paginatedVideos, limit, page);

  return paginatedResult;
};

/**
 * Fetches video with given id.
 * @param id
 */
export const fetchVideoById = async (id: number): Promise<Video | null> => {
  const video = await Video.findByPk(id);

  return video;
};

/**
 * Creates new video from given data.
 * @param attributes
 */
export const uploadVideo = async (
  attributes: { name: string; price: number },
  videoFile: Express.Multer.File
): Promise<Video> => {
  const { path, size } = await saveVideoInLocalStorage(videoFile);

  const video = await Video.create({
    name: attributes.name,
    price: attributes.price,
    path,
    size,
  });

  return video;
};

/**
 * Prepares video stream data for video with given id.
 * Returns null if video with the given id does not exist.
 * @param videoId
 * @param rangeHeader
 */
export const streamVideo = async (
  videoId: number,
  rangeHeader: string
): Promise<null | VideoStreamData> => {
  const video = await Video.findByPk(videoId);
  if (!video) return null;

  const videoPathInServer = `${global.appRoot}/${video.path}`;

  const byteRange = determineStartAndEndBytes(video.size, rangeHeader);
  const videoPath = videoPathInServer;

  return { byteRange, videoPath, videoSize: video.size };
};

/**
 * Removes video from the server and database.
 * Returns null if video with the given id does not exist.
 * @param videoId
 */
export const deleteVideo = async (videoId: number): Promise<true | null> => {
  const video = await Video.findByPk(videoId);
  if (!video) return null;

  await fs.unlink(`${global.appRoot}/${video.path}`);

  await video.destroy();
  return true;
};
