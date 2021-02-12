import { Video } from "../models/video.model";
import faker from 'faker';
import Factory from "./factory";

class VideoFactory extends Factory<Video> {

    model = Video;

    attributes = {
        name: faker.name.findName(),
        size: faker.random.number({ min: 1, max: 99999 }),
        price: faker.random.number({ min: 1, max: 1000 }),
        path: `uploads/videos/${faker.system.fileName()}`
    }
}

export default new VideoFactory;