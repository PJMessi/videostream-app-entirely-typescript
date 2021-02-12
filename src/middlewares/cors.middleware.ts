import { NextFunction, Request, Response } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', '*');

    if (request.method === 'OPTIONS') return response.status(200).send();

    next();
};