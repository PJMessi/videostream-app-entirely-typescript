import { NextFunction, Request, Response } from "express";
import { paginate, create, getById } from "@services/video.service";
import createError from 'http-errors';

// Paginates the videos.
export const paginateVideos = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const paginationFilters = request.query;

        const paginatedVideos = await paginate(paginationFilters);

        return response.json({
            message: 'Paginated videos.',
            data: paginatedVideos
        });

    } catch (error) {
        next(error);
    }
}

// Fetch video with given id.
export const fetchVideo = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const videoId = parseInt(request.params.videoId);
    
        const video = await getById(videoId);
        if (!video) {
            throw new createError.NotFound('Video with the given id not found.');
        }
        
        return response.json({
            message: 'Video with given id.',
            data: { video }
        });

    } catch (error) {
        next(error);
    }
}