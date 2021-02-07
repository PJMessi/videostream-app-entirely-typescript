import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { getById } from '@services/user.service';
import accessEnv from "@helpers/accessEnv";
import { User } from '@root/database/models/user.model';

declare global {
    namespace Express {
        interface Request {
            auth: { user?: User }
        }
    }
}

export default async (
    request: Request,
    resonse: Response,
    next: NextFunction

) => {
    try {
        let bearerToken = request.headers.authorization;
        if (!bearerToken) {
            throw new createError.Unauthorized('Bearer token not provided.');
        }

        bearerToken = parseBearerToken(bearerToken);

        let decodedObject = decodeData(bearerToken)

        const user = await getById(decodedObject.id);
        if (!user) {
            throw new createError.Unauthorized();
        }

        request.auth = { user }

        next();

    } catch (error) { 
        next(error); 
    }
};

// Decodes the data from the bearer token.
const decodeData = (bearerToken: string) => {
    
    const JWT_SECRET = accessEnv("JWT_SECRET", "jsonwebtoken");

    let decodedObject: any;

    jwt.verify(bearerToken, JWT_SECRET, (error: any, decoded: any) => {
        if (error) {
            throw new createError.Unauthorized();
        }

        decodedObject = decoded;
    });

    return decodedObject;
}

// Parses bearer token.
const parseBearerToken = (bearerToken: string): string => {

    // removing 'Bearer ' from the token.
    bearerToken = bearerToken.substring(7); 

    return bearerToken;
}