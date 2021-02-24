import path from 'path';
import { promises as fs } from 'fs';

export const videoDirectory = path.resolve(`${__dirname}/../uploads/videos`);

const generateUniqueFileName = (originalFileName: string): string => {
  const extension = path.extname(originalFileName);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileName = `${uniqueSuffix}${extension}`;
  return fileName;
};

/**
 * Creates directory if the directory does not exist.
 * @param directory
 */
const generateDirectory = async (directory: string): Promise<void> => {
  await fs.stat(directory).catch(async () => {
    await fs.mkdir(directory, { recursive: true });
  });
};

export const saveVideoInLocalStorage = async (
  fileObject: Express.Multer.File
): Promise<{ path: string; size: number }> => {
  const videoName = generateUniqueFileName(fileObject.originalname);

  await generateDirectory(videoDirectory);

  const videoPath = `${videoDirectory}/${videoName}`;
  await fs.writeFile(videoPath, fileObject.buffer);

  return { path: videoName, size: fileObject.size };
};

export const prepareVideoStreamHeader = (
  startByte: number,
  endByte: number,
  totalBytes: number
): {
  'Content-Range': string;
  'Accept-Ranges': string;
  'Content-Length': number;
  'Content-Type': string;
} => {
  return {
    'Content-Range': `bytes ${startByte}-${endByte}/${totalBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': endByte - startByte + 1,
    'Content-Type': 'video/mp4',
  };
};
