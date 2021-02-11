import { NextFunction, Request, Response } from "express";
import { paginateVideosForUsers, fetchVideoById } from "@services/video.service";
import createError from 'http-errors';

/**
 * Paginates the videos.
 * @param request 
 * @param response 
 * @param next 
 */
export const paginate = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { limit, page, sortBy, sortOrder }: 
        { limit?: number, page?: number, sortBy?: string, sortOrder?: 'ASC'|'DESC' } = request.query;

        const paginatedVideos = await paginateVideosForUsers({limit, page, sortBy, sortOrder});

        return response.json({
            success: true,
            data: paginatedVideos
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Fetches video with given id.
 * @param request 
 * @param response 
 * @param next 
 */
export const show = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const videoId = parseInt(request.params.videoId);
    
        const video = await fetchVideoById(videoId);
        if (!video)
            throw new createError.NotFound('Video with the given id not found.');
        
        return response.json({
            success: true,
            data: { video }
        });

    } catch (error) {
        next(error);
    }
}