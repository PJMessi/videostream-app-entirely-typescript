import { NextFunction, Request, Response } from "express";
import { create } from "@services/video.service";

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