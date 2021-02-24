import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { getUserWithGivenId } from '@services/user.service';
import accessEnv from '@helpers/accessEnv';

const parseBearerToken = (bearerToken: string): string => {
  return bearerToken.substring(7);
};

const decodeData = (bearerToken: string): string => {
  try {
    const JWT_SECRET = accessEnv('JWT_SECRET', 'jsonwebtoken');
    const jwtPayload = <string>jwt.verify(bearerToken, JWT_SECRET);
    return jwtPayload;
  } catch (error) {
    throw new createError.Unauthorized();
  }
};

export default async (
  request: Request,
  resonse: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let bearerToken = request.headers.authorization;
    if (!bearerToken)
      throw new createError.Unauthorized('Bearer token not provided.');

    bearerToken = parseBearerToken(bearerToken);
    const decodedUserId = decodeData(bearerToken);

    const user = await getUserWithGivenId(parseInt(decodedUserId, 10));
    if (!user) throw new createError.Unauthorized();

    request.auth = { user };

    return next();
  } catch (error) {
    return next(error);
  }
};
