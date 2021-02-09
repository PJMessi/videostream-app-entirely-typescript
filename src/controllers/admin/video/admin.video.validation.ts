import { NextFunction, Request, Response } from "express";
import validator from "@helpers/validation.helper";
import multer from 'multer';
import createError from 'http-errors';

const uploadMiddleware = multer();

// form-data/multipart middleware.
export const videoUploadValidation = uploadMiddleware.single('video'); 

// validates the data for create function in video.controller.
export const createValidation = async (
    request: Request,
    response: Response, 
    next: NextFunction

) => {
	try {
		const { name, size, price, path } = request.body;
        const videoFile = request.file;

		const rules = {
			name: 'required|string|min:1|max:255',
            price: 'required|integer|min:1|max:999999',
		};
                
		await validator({ name, size, price, path }, rules);

        if (!videoFile) {
            throw new createError.UnprocessableEntity(JSON.stringify({
                video: ['Video is required.']
            }));
        }

        if (videoFile.mimetype != 'video/mp4') {
            throw new createError.UnprocessableEntity(JSON.stringify({
                video: ['Invalid video file.']
            }));
        }
	        
		next();
        
    } catch (error) { 
        next(error);
    }
}