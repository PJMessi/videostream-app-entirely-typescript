import { NextFunction, Request, Response } from 'express';
import {
  paginateVideos,
  fetchVideoById,
  streamVideo,
} from '@services/video.service';
import createError from 'http-errors';
import fs from 'fs';
import { prepareVideoStreamHeader } from '@helpers/videoupload.helper';
import { VideoPaginationSort } from '@root/types/pagination/video';

/**
 * Paginates the video according to the given filters.
 * @param request
 * @param response
 * @param next
 */
export const paginate = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // type is validated in validation middleware.
    const paginationFilter: {
      limit?: number;
      page?: number;
      sortBy?: VideoPaginationSort;
      sortOrder?: 'ASC' | 'DESC';
    } = request.query;

    const paginatedVideos = await paginateVideos(paginationFilter);

    return response.json({
      success: true,
      data: paginatedVideos,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Fetches the video with given id.
 * @param request
 * @param response
 * @param next
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const videoId = parseInt(request.params.videoId, 10);

    const video = await fetchVideoById(videoId);
    if (!video)
      throw new createError.NotFound('Video with the given id not found.');

    return response.json({
      success: true,
      data: { video },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Pipes the data of the video with given id for streaming.
 * @param request
 * @param response
 * @param next
 */
export const stream = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const rangeHeader = request.headers.range;
    if (!rangeHeader) throw new createError.BadRequest('Range header missing.');

    const videoId = parseInt(request.params.videoId, 10);
    const videoStreamData = await streamVideo(videoId, rangeHeader);
    if (!videoStreamData)
      throw new createError.NotFound('Video with given id not found.');

    const { byteRange, videoPath, videoSize } = videoStreamData;
    const [startByte, endByte] = byteRange;
    const headers = prepareVideoStreamHeader(startByte, endByte, videoSize);

    const readStream = fs.createReadStream(videoPath, {
      start: startByte,
      end: endByte,
    });
    response.writeHead(206, headers);
    return readStream.pipe(response);
  } catch (error) {
    return next(error);
  }
};
