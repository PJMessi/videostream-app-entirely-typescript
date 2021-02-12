import { NextFunction, request, Request, Response } from "express";
import validator from "@helpers/validation.helper";
import createError from 'http-errors';

/**
 * Validates request data for `paginate` function of video.controller.
 * @param request 
 * @param response 
 * @param next 
 */
export const paginateValidation = async ( request: Request, response: Response, next: NextFunction) => {
	try {
		const { limit, page, sortOrder, sortBy } = request.query;

		const rules = {
			limit: 'integer|min:1|max:1000',
			page: 'integer|min:1|max:99999',
            sortBy: 'string|in:id,name,price,size,path',
            sortOrder: 'string|in:ASC,DESC'
		};
                
		await validator({ limit, page, sortOrder, sortBy }, rules);
	        
		next();
        
    } catch (error) { 
		next(error);
	 }
}

/**
 * Validates request data for `stream` function of video.controller.
 * @param request 
 * @param response 
 * @param next 
 */
export const streamValidation = async ( request: Request, response: Response, next: NextFunction ) => {
	try {
		const { range } = request.headers;

		if (!range) throw new createError.BadRequest('Range header missing.');

	} catch (error) {
		next(error);
	}
}