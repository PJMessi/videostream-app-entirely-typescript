import { NextFunction, Request, Response } from "express";
import { paginateVideosForUsers, fetchVideoById, streamVideo } from "@services/video.service";
import createError from 'http-errors';
import fs from 'fs';

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

/**
 * Streams the video with given id. 
 * @param request 
 * @param response 
 * @param next
 */
export const stream = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const rangeHeader = request.headers.range!;
        
        const videoId = parseInt(request.params.videoId);
        const videoStreamData = await streamVideo(videoId, rangeHeader);
        if (!videoStreamData) 
            throw new createError.NotFound('Video with given id not found.');
    
        const { byteRange, videoPath, videoSize } = videoStreamData;
        const [startByte, endByte] = byteRange;
    
        const headers = {
            'Content-Range': `bytes ${startByte}-${endByte}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': endByte - startByte + 1,
            'Content-Type': 'video/mp4',
        };
        
        const readStream = fs.createReadStream(videoPath, { start: startByte, end: endByte });
        response.writeHead(206, headers);
        readStream.pipe(response);

    } catch (error) {
        next(error);
    }
}