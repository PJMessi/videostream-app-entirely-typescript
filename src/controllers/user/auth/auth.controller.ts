import { NextFunction, Request, Response } from "express";
import { registerUser, loginUser } from '@services/user.service';

/**
 * Checks if user with given email and password exists. If it does, returns user data and auth token.
 * @param request 
 * @param response 
 * @param next 
 */
export const login = async ( request: Request, response: Response, next: NextFunction ) => {
    try {
        const { email, password } = request.body;

        const { userData, authToken } = await loginUser({ email, password });

        return response.json({
            success: true,
            data: { user: userData, token: authToken }
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Creates new user. Returns user data and auth token.
 * @param request 
 * @param response 
 * @param next 
 */
export const register = async ( request: Request, response: Response, next: NextFunction ) => {
    try {
        const { name, email, password } = request.body;

        const { userData, authToken } = await registerUser({ name, email, password });

        return response.status(201).json({
            success: true,
            data: { user: userData, token: authToken }
        });
        
    } catch (error) {
        next(error);
    }
}

/**
 * Returns the data of currently logged in user.
 * @param request 
 * @param response 
 * @param next 
 */
export const profile = async ( request: Request, response: Response, next: NextFunction ) => {
    try {
        const user = request.auth.user;

        const userData = user?.toJSON();

        return response.json({
            success: true,
            data: { user: userData }
        });
        
    } catch (error) {
        next(error);
    }
}