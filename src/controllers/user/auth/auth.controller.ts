import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser } from '@services/user.service';
import createError from 'http-errors';

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email, password } = request.body;

    const { userData, authToken } = await loginUser({ email, password });

    return response.json({
      success: true,
      data: { user: userData, token: authToken },
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name, email, password } = request.body;

    const { userData, authToken } = await registerUser({
      name,
      email,
      password,
    });

    return response.status(201).json({
      success: true,
      data: { user: userData, token: authToken },
    });
  } catch (error) {
    return next(error);
  }
};

export const profile = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { user } = request.auth;
    if (!user) throw new createError.Unauthorized();

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response.json({
      success: true,
      data: { user: userData },
    });
  } catch (error) {
    return next(error);
  }
};
