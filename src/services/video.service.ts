import { Video } from '@models/video.model';
import {
  appendPaginationData,
  PaginationFilter,
  PaginationResult,
  refineFiltersForPagination,
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

export const fetchVideoById = async (id: number): Promise<Video | null> => {
  const video = await Video.findByPk(id);

  return video;
};

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

export const deleteVideo = async (videoId: number): Promise<true | null> => {
  const video = await Video.findByPk(videoId);
  if (!video) return null;

  await fs.unlink(`${videoDirectory}/${video.path}`);

  await video.destroy();
  return true;
};
