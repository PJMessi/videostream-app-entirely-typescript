import { NextFunction, Request, Response } from 'express';
import validator from '@helpers/validation.helper';
import multer from 'multer';
import createError from 'http-errors';

const uploadMiddleware = multer();

// form-data/multipart middleware.
export const videoUploadValidation = uploadMiddleware.single('video');

/**
 * Validation for `store` function in adminVideo.controller.
 * @param request
 * @param response
 * @param next
 */
export const storeValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, size, price, path } = request.body;
    const videoFile = request.file;

    const rules = {
      name: 'required|string|min:1|max:255',
      price: 'required|numeric|min:1|max:999999',
    };

    await validator({ name, size, price, path }, rules);

    if (!videoFile) {
      throw new createError.UnprocessableEntity(
        JSON.stringify({
          video: ['Video is required.'],
        })
      );
    }

    if (videoFile.mimetype !== 'video/mp4') {
      throw new createError.UnprocessableEntity(
        JSON.stringify({
          video: ['Invalid video file.'],
        })
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
