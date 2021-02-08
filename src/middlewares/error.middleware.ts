import { NextFunction, Request, Response } from "express";

export default (error: any, request: Request, response: Response, next: NextFunction) => {
	
    const status = error.status || 500;

	if (status == 500) console.log(error);

	if (status == 422) {
        return response.status(422).json({
            message: 'The given data was invalid.',
			errors: JSON.parse(error.message)
        });
	}
    
	return response.status(status).json({ message: error.message });
};