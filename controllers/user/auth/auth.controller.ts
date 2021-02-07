import { NextFunction, Request, Response } from "express";
import { getOne, create } from '@services/user.service';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

// Genrates auth token if the credentials are correct.
export const login = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const { email, password } = request.body;

        const user = await getOne({ email });
        if (!user) {
            throw new createError.Unauthorized('Invalid credentials.');
        }

        const doesPasswordMatch = await bcrypt.compare(password, user.password); 
        if (!doesPasswordMatch) {
            throw new createError.Unauthorized('Invalid credentials.');
        }

        const token = user.generateToken();

        return response.json({
            message: 'Auth token.',
            data: { user, token }
        });

    } catch (error) {
        next(error);
    }
}

// Creates new user form the given data.
export const register = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const attributes = request.body;

        const user = await create(attributes);

        const token = user.generateToken();

        return response.status(201).json({
            message: 'Registered user with auth token.',
            data: { user, token }
        });

    } catch (error) {
        next(error);
    }
}

// Returns the data of the logged in user.
export const profile = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {

    try {
        const user = request.auth.user;

        return response.json({
            message: 'Data of the auth user.',
            data: { user }
        });
        
    } catch (error) {
        next(error);
    }
}