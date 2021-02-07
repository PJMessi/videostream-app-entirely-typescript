import { NextFunction, Request, Response } from "express";

import validator from "@helpers/validator";

// validates the data for paginate function in video.controller.
export const paginateValidation = async (
    request: Request,
    response: Response, 
    next: NextFunction

) => {
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
        
    } catch (error) { next(error); }
}

// validates the data for create function in video.controller.
export const createValidation = async (
    request: Request,
    response: Response, 
    next: NextFunction

) => {
	try {
		const { name, size, price, path } = request.body;

		const rules = {
			name: 'required|string|min:1|max:255',
			path: 'required|string|min:1|max:255',
            price: 'required|integer|min:1|max:9999999999',
            size: 'required|integer:min:1|max:9999999999'
		};
                
		await validator({ name, size, price, path }, rules);
	        
		next();
        
    } catch (error) { next(error); }
}