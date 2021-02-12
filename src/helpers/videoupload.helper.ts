import path from 'path';
import { promises as fs } from 'fs';

/**
 * Saves video in server with unique name.
 * For test environment, video is not saved in server.
 * @param fileObject 
 */
export const saveVideoInLocalStorage = async (fileObject: Express.Multer.File): Promise<{ path: string, size: number }> => {
    const fileName = generateUniqueFileName(fileObject.originalname);

    const videoDirectory = `${global.appRoot}/uploads/videos`;
    await generateDirectory(videoDirectory);

    const filePath = `uploads/videos/${fileName}`; 
    
    await fs.writeFile(filePath, fileObject.buffer);

    return { path: filePath, size: fileObject.size }
}

/**
 * Generates unique filename for video.
 * @param originalFileName 
 */
const generateUniqueFileName = (originalFileName: string): string => {
    const extension = path.extname(originalFileName);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${extension}`;

    return fileName;
}

/**
 * Creates directory if the directory does not exist.
 * @param directory 
 */
const generateDirectory = async (directory: string): Promise<void> => {
    await fs.stat(directory)
    .catch(async (err) => {
        await fs.mkdir(directory, { recursive: true });
    });
}