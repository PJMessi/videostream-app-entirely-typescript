import { NextFunction, Request, Response } from "express";
import { uploadVideo } from "@services/video.service";

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