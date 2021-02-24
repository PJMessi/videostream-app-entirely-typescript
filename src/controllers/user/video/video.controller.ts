import { NextFunction, Request, Response } from 'express';
import {
  paginateVideosForUsers,
  fetchVideoById,
  streamVideo,
} from '@services/video.service';
import createError from 'http-errors';
import fs from 'fs';

export const paginate = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const {
      limit,
      page,
      sortBy,
      sortOrder,
    }: {
      limit?: number;
      page?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    } = request.query;

    const paginatedVideos = await paginateVideosForUsers({
      limit,
      page,
      sortBy,
      sortOrder,
    });

    return response.json({
      success: true,
      data: paginatedVideos,
    });
  } catch (error) {
    return next(error);
  }
};

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

    const headers = {
      'Content-Range': `bytes ${startByte}-${endByte}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': endByte - startByte + 1,
      'Content-Type': 'video/mp4',
    };

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
