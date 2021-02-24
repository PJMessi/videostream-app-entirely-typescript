import { NextFunction, Request, Response } from 'express';
import validator from '@helpers/validation.helper';
import createError from 'http-errors';

export const paginateValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit, page, sortOrder, sortBy } = request.query;

    const rules = {
      limit: 'integer|min:1|max:1000',
      page: 'integer|min:1|max:99999',
      sortBy: 'string|in:id,name,price,size,path',
      sortOrder: 'string|in:ASC,DESC',
    };

    await validator({ limit, page, sortOrder, sortBy }, rules);

    return next();
  } catch (error) {
    return next(error);
  }
};

export const streamValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { range } = request.headers;
    if (!range) throw new createError.BadRequest('Range header missing.');

    return next();
  } catch (error) {
    return next(error);
  }
};
