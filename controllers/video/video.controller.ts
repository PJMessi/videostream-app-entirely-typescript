import { NextFunction, Request, Response } from "express";
import { paginate, create, getById } from "#root/services/video.service";

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

// Creates new video.
export const createVideo = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const attributes = request.body;
    
        const video = await create(attributes);
    
        return response.json({
            message: 'Created video.',
            data: { video } 
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

        return response.json({
            message: 'Video with given id.',
            data: { video }
        });

    } catch (error) {
        next(error);
    }
}