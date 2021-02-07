import { NextFunction, Request, Response } from "express";
import validator from "@helpers/validator";

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
        
    } catch (error) { 
        next(error);
    }
}