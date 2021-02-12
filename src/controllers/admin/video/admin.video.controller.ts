import { NextFunction, Request, Response } from "express";
import { uploadVideo, deleteVideo } from "@services/video.service";
import createError from 'http-errors';

/**
 * Uploads video and saves its record in database.
 * @param request 
 * @param response 
 * @param next 
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { name, price }: { name: string, price: number } = request.body;

        const video = await uploadVideo({ name, price }, request.file);
    
        return response.json({
            success: true,
            data: { video } 
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Deletes the video with given id from the server and database.
 * @param request 
 * @param response 
 * @param next 
 */
export const destroy = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const videoId = parseInt(request.params.videoId);

        const videoDeleted = await deleteVideo(videoId);
        if (!videoDeleted) throw new createError.NotFound('Video not found.');

        return response.json({
            success: true,
            message: 'Video deleted.'
        });

    } catch (error) {
        next(error);
    }
}