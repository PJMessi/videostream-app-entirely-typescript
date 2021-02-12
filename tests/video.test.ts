import "module-alias/register";
import { assert } from 'chai';
import request from 'supertest';
import server from '@root/app';
import userFactory from '@factories/user.factory';
import videoFactory from '@factories/video.factory';

const app = request.agent(server);

describe('Videos', () => {
	describe('GET /videos', () => {

		it ('returns paginated list of videos.', async () => {
            /** Creating a user. */
            const user = await userFactory.createSingle();
            const authToken = user.generateToken();

            /** Creating 15 videos. */
            const videos = await videoFactory.createMultiple(15);

            /** Calling API to fetch paginated list of videos. */
			const paginatedVideosResponse = await app.get('/videos').set('Authorization', `Bearer ${authToken}`);
            assert.equal(paginatedVideosResponse.status, 200);
            const paginatedVideosResponseData = paginatedVideosResponse.body.data;
            
            // checking pagination meta data in response.
            assert.equal(paginatedVideosResponseData.count, 15);
            assert.equal(paginatedVideosResponseData.lastPage, 2);
            assert.equal(paginatedVideosResponseData.currentPage, 1);
            assert.equal(paginatedVideosResponseData.from, 1);
            assert.equal(paginatedVideosResponseData.perPage, 10);
            assert.equal(paginatedVideosResponseData.to, 10);

            // checking videos in response.
            const videosResponse = paginatedVideosResponseData.rows;
            assert.equal(10, videosResponse.length);
            for (let [index, videoResponse] of videosResponse.entries()) {
                assert.equal(videoResponse.id, videos[15 - index - 1].id);
                assert.equal(videoResponse.name, videos[15 - index - 1].name);
                assert.equal(videoResponse.path, videos[15 - index - 1].path);
                assert.equal(videoResponse.price, videos[15 - index - 1].price);
                assert.equal(videoResponse.size, videos[15 - index - 1].size);
                assert.equal(videoResponse.createdAt, videos[15 - index - 1].createdAt.toISOString());
                assert.equal(videoResponse.updatedAt, videos[15 - index - 1].updatedAt.toISOString());
            }
        });

        it ('returns authentication error if bearer token is not provided or is invalid.', async () => {
			/** Calling API to fetch videos without token. */
			const videosResponseWithoutToken = await app.get('/videos');
			assert.equal(videosResponseWithoutToken.status, 401);

			/** Calling API to fetch videos fetch profile without token. */
			const videosResponseWithInvalidToken = await app.get('/videos').set('Authorization', 'Bearer invalid token');
			assert.equal(videosResponseWithInvalidToken.status, 401);
		});
        
    });

    describe('GET /videos/:videoId', () => {

        it ('returns the video with given id.', async () => {
            /** Creating a user. */
            const user = await userFactory.createSingle();
            const authToken = user.generateToken();

            /** Creating a video. */
            const video = await videoFactory.createSingle();

            /** Calling API to fetch video with given id. */
            const videoResponse = await app.get(`/videos/${video.id}`).set('Authorization', `Bearer ${authToken}`);
            assert.equal(videoResponse.status, 200);
            const videoResponseData = videoResponse.body.data.video;

            // checking response.
            assert.equal(videoResponseData.id, video.id);
            assert.equal(videoResponseData.name, video.name);
            assert.equal(videoResponseData.path, video.path);
            assert.equal(videoResponseData.price, video.price);
            assert.equal(videoResponseData.size, video.size);
            assert.equal(videoResponseData.createdAt, video.createdAt.toISOString());
            assert.equal(videoResponseData.updatedAt, video.updatedAt.toISOString());
        });

        it ('returns not found error if video with the given id does not exist', async () => {
            /** Creating a user. */
            const user = await userFactory.createSingle();
            const authToken = user.generateToken();

            /** Calling API to fetch video with given id. */
            const videoResponse = await app.get(`/videos/1111111111`).set('Authorization', `Bearer ${authToken}`);
            assert.equal(videoResponse.status, 404);
        });

        it ('returns authentication error if bearer token is not provided or is invalid.', async () => {
			/** Calling API to fetch videos without token. */
			const videoResponseWithoutToken = await app.get('/videos/1');
			assert.equal(videoResponseWithoutToken.status, 401);

			/** Calling API to fetch videos fetch profile without token. */
			const videosResonseWithInvalidToken = await app.get('/videos/1').set('Authorization', 'Bearer invalid token');
			assert.equal(videosResonseWithInvalidToken.status, 401);
		});

    });
});