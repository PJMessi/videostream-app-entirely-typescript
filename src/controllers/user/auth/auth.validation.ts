import { NextFunction, Request, Response } from 'express';
import { getUserWithGivenEmail } from '@services/user.service';
import createError from 'http-errors';
import validator from '@helpers/validation.helper';

export const loginValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = request.body;

    const rules = {
      email: 'required|email|string',
      password: 'required|string',
    };

    await validator({ email, password }, rules);

    return next();
  } catch (error) {
    return next(error);
  }
};

export const registerValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (request.body.email)
      request.body.email = request.body.email.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, email, password, password_confirmation } = request.body;

    const rules = {
      name: 'required|string|max:255',
      email: 'required|string|email|max:255',
      password: 'required|string|confirmed|max:255',
    };

    await validator({ name, email, password, password_confirmation }, rules);

    const userWithTheEmail = await getUserWithGivenEmail(email);
    if (userWithTheEmail) {
      throw new createError.UnprocessableEntity(
        JSON.stringify({ email: ['User with that email already exists.'] })
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
