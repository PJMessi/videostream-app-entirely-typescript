import { NextFunction, Request, Response } from 'express';
import { uploadVideo, deleteVideo } from '@services/video.service';
import createError from 'http-errors';

export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, price }: { name: string; price: number } = request.body;

    const video = await uploadVideo({ name, price }, request.file);

    return response.json({
      success: true,
      data: { video },
    });
  } catch (error) {
    return next(error);
  }
};

export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const videoId = parseInt(request.params.videoId, 10);

    const videoDeleted = await deleteVideo(videoId);
    if (!videoDeleted) throw new createError.NotFound('Video not found.');

    return response.json({
      success: true,
      message: 'Video deleted.',
    });
  } catch (error) {
    return next(error);
  }
};
