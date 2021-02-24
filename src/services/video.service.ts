import { Video } from '@models/video.model';
import {
  calculateOffset,
  DefaultLimit,
  DefaultPage,
  DefaultSortOrder,
  generatePaginationHelpers,
} from '@helpers/pagination.helper';
import {
  saveVideoInLocalStorage,
  videoDirectory,
} from '@helpers/videoupload.helper';
import {
  determineStartAndEndBytes,
  VideoStreamData,
} from '@helpers/videoStream.helper';
import { promises as fs } from 'fs';
import { PaginationResult } from '@root/types/pagination';
import { VideoPaginationFilter } from '@root/types/pagination/video';

/**
 * Paginates video based on given pagination filters.
 * @param paginationFilter
 */
export const paginateVideos = async (
  paginationFilter: VideoPaginationFilter
): Promise<PaginationResult<Video>> => {
  const limit = paginationFilter.limit || DefaultLimit;
  const page = paginationFilter.page || DefaultPage;
  const sortOrder = paginationFilter.sortOrder || DefaultSortOrder;
  const sortBy = paginationFilter.sortBy || 'id';
  const offset = calculateOffset(page, limit);

  const paginatedVideos = await Video.findAndCountAll({
    attributes: { exclude: ['path'] },
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });

  const paginationHelpers = generatePaginationHelpers(
    limit,
    page,
    paginatedVideos.count
  );

  return { ...paginatedVideos, ...paginationHelpers };
};

/**
 * Fetches video by id.
 * @param id
 */
export const fetchVideoById = async (id: number): Promise<Video | null> => {
  const video = await Video.findByPk(id);
  return video;
};

/**
 * Uploads video in the server and saves its info in database.
 * @param attributes
 * @param videoFile
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
 * Prepares video stream data for the video with the given id, based on given range header.
 * @param videoId
 * @param rangeHeader
 */
export const streamVideo = async (
  videoId: number,
  rangeHeader: string
): Promise<null | VideoStreamData> => {
  const video = await Video.findByPk(videoId);
  if (!video) return null;

  const videoPathInServer = `${videoDirectory}/${video.path}`;

  const byteRange = determineStartAndEndBytes(video.size, rangeHeader);
  const videoPath = videoPathInServer;

  return { byteRange, videoPath, videoSize: video.size };
};

/**
 * Deletes video file from server and removes its info from the database.
 * @param videoId
 */
export const deleteVideo = async (videoId: number): Promise<true | null> => {
  const video = await Video.findByPk(videoId);
  if (!video) return null;

  await fs.unlink(`${videoDirectory}/${video.path}`);

  await video.destroy();
  return true;
};
