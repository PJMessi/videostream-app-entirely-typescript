import { NextFunction, Request, Response } from "express";
import { getOne } from '@services/user.service';
import createError from 'http-errors';
import validator from "@helpers/validation.helper";

// validates the data for login function in auth.controller.
export const loginValidation = async (
    request: Request,
    response: Response, 
    next: NextFunction

) => {
	try {
		const { email, password } = request.body;

		const rules = {
            email: 'required|email|string',
            password: 'required|string',
		};
                
		await validator({ email, password }, rules);
	        
		next();
        
    } catch (error) { next(error); }
}


// validates the data for register function in auth.controller.
export const registerValidation = async (
    request: Request,
    response: Response, 
    next: NextFunction

) => {
	try {
		// converting the email to lowercase.
		if (request.body.email) request.body.email = request.body.email.toLowerCase();

		const { name, email, password, password_confirmation } = request.body;

		const rules = {
			name: 'required|string|max:255',
			email: 'required|string|email|max:255',
			password: 'required|string|confirmed|max:255'
		};
		
		await validator({ name, email, password, password_confirmation }, rules);

		const userWithTheEmail = await getOne({ email });
		if (userWithTheEmail) {
			throw new createError.UnprocessableEntity(JSON.stringify({
				email: ['User with that email already exists.']
			}));
		}
        
		next();
        
	} catch (error) { next(error); }
}