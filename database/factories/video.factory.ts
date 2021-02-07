import faker from 'faker';
import { Video, VideoAttributes, VideoUpdateAttributes } from '../models/video.model';

// creates multiple videos.
export const createVideos = async (amount: number, customAttributes?: VideoUpdateAttributes): Promise<Video[]> => {
    let videos: Video[] = [];

    for (let i = 0; i < amount; i++) {
        const video = await createVideo(customAttributes);
        videos.push(video)
    }

    return videos;
}

// create single video.
export const createVideo = async (customAttributes?: VideoUpdateAttributes): Promise<Video> => {
    const randomAttributes = generateRandomAttributes();

    customAttributes = customAttributes || {};

    const finalAttributes = generateFinalAttributes(randomAttributes, customAttributes);

    const video = await Video.create(finalAttributes);
    return video;
}

const generateRandomAttributes = (): VideoAttributes => {
    return {
        name: faker.name.findName(),
        size: faker.random.number({ min: 1, max: 99999 }),
        price: faker.random.number({ min: 1, max: 1000 }),
        path: `uploads/videos/${faker.system.fileName()}`
    };
}

const generateFinalAttributes = (
    randomAttributes: VideoAttributes,
    customAttributes: VideoUpdateAttributes

): VideoAttributes => {

    return { ...randomAttributes, ...customAttributes }
}
