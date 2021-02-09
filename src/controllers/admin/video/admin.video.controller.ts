import { NextFunction, Request, Response } from "express";
import { create } from "@services/video.service";
import path from 'path';
import { promises as fs } from 'fs';

// Creates new video.
export const createVideo = async (
    request: Request,
    response: Response,
    next: NextFunction

) => {
    try {
        const { name, price } = request.body;
        const { path, size } = await saveVideo(request.file);

        const video = await create({ name, price, size, path });
    
        return response.json({
            message: 'Created video.',
            data: { video } 
        });

    } catch (error) {
        next(error);
    }
}


// Generates a unique file name.
const generateUniqueFileName = (originalFileName: string): string => {
    const extension = path.extname(originalFileName);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${extension}`;

    return fileName;
}

// saves the file in the server with unique name.
const saveVideo = async (fileObject: Express.Multer.File): Promise<{ path: string, size: number }> => {
    const fileName = generateUniqueFileName(fileObject.originalname);

    const videoDirectory = `${global.appRoot}/uploads/videos`;
    await generateDirectory(videoDirectory);

    const filePath = `uploads/videos/${fileName}`;    
    await fs.writeFile(filePath, fileObject.buffer);

    return { path: filePath, size: fileObject.size }
}

// Creates directory if it doesnt exist.
const generateDirectory = async (directory: string) => {
    await fs.stat(directory)
    .catch(async (err) => {
        await fs.mkdir(directory, { recursive: true });
    });
}