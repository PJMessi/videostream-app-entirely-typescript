import 'module-alias/register';
import { assert } from 'chai';
import request from 'supertest';
import server from '@root/app';
import { Video } from '@models/video.model';
import fs from 'fs';
import { videoDirectory } from '@helpers/videoupload.helper';

const app = request.agent(server);

describe('Admin: Videos', () => {
  describe('POST /admin/videos', () => {
    it('saves video in server and saves its record in database.', async () => {
      /** Preparing test video data. */
      const testVideoPath = `${__dirname}/dependencies/test-video.mp4`;
      const testVideoFileStat = fs.statSync(testVideoPath);
      const testVideoData = {
        name: 'Test Video',
        price: 15,
      };

      /** Calling API to upload video. */
      const videoCreateResponse = await app
        .post('/admin/videos')
        .field('name', testVideoData.name)
        .field('price', testVideoData.price)
        .attach('video', testVideoPath);
      assert.equal(videoCreateResponse.status, 200);

      // checking video in response.
      const videoCreateResponseData = videoCreateResponse.body.data.video;
      const video = await Video.findOne({ order: [['id', 'DESC']] });

      assert.equal(video?.id, videoCreateResponseData.id);
      assert.equal(video?.name, videoCreateResponseData.name);
      assert.equal(video?.price, videoCreateResponseData.price);
      assert.equal(video?.size, videoCreateResponseData.size);
      assert.equal(
        video?.createdAt.toISOString(),
        videoCreateResponseData.createdAt
      );
      assert.equal(
        video?.updatedAt.toISOString(),
        videoCreateResponseData.updatedAt
      );

      // checking video in database.
      assert.equal(video?.name, testVideoData.name);
      assert.equal(video?.price, testVideoData.price);
      assert.equal(video?.size, testVideoFileStat.size);

      // Checking if video is saved in server and deleting it.
      fs.unlinkSync(`${videoDirectory}/${video?.path}`);
    });

    it('returns validation errors if no data are provided.', async () => {
      /** Calling API to upload video. */
      const videoCreateResponse = await app.post('/admin/videos');

      // checking response.
      assert.equal(videoCreateResponse.status, 422);
      assert.hasAllKeys(videoCreateResponse.body.errors, ['name', 'price']);
    });

    it('returns validation errors if invalid data are provided.', async () => {
      /** Preparing test video data. */
      const testVideoPath = `${__dirname}/dependencies/test-video.mp4`;
      const testVideoData = {
        name: '',
        price: 0,
      };

      /** Calling API to upload video. */
      const videoCreateResponse = await app
        .post('/admin/videos')
        .field('name', testVideoData.name)
        .field('price', testVideoData.price)
        .attach('video', testVideoPath);

      // checking response.
      assert.equal(videoCreateResponse.status, 422);
      assert.hasAllKeys(videoCreateResponse.body.errors, ['name', 'price']);
    });

    it('returns validation errors if mp4 video is not provided.', async () => {
      /** Preparing test video data. */
      const testVideoPath = `${__dirname}/dependencies/test-video.mov`;
      const testVideoData = {
        name: 'Test Video',
        price: 15,
      };

      /** Calling API to upload video. */
      const videoCreateResponse = await app
        .post('/admin/videos')
        .field('name', testVideoData.name)
        .field('price', testVideoData.price)
        .attach('video', testVideoPath);

      // checking response.
      assert.equal(videoCreateResponse.status, 422);
      assert.hasAllKeys(videoCreateResponse.body.errors, ['video']);
    });
  });

  describe('DELETE /admin/videos/:videoId', () => {
    it('deletes video from database and server.', async () => {
      /** Preparing test video data. */
      const testVideoPath = `${__dirname}/dependencies/test-video.mp4`;
      const testVideoData = {
        name: 'Test Video',
        price: 15,
      };

      /** Calling API to upload video. */
      const videoCreateResponse = await app
        .post('/admin/videos')
        .field('name', testVideoData.name)
        .field('price', testVideoData.price)
        .attach('video', testVideoPath);
      assert.equal(videoCreateResponse.status, 200);

      /** Calling API to delete video. */
      let video = await Video.findByPk(videoCreateResponse.body.data.video.id);
      const videoDeleteResponse = await app.delete(
        `/admin/videos/${video?.id}`
      );
      assert.equal(videoDeleteResponse.status, 200);

      // checking if video file is deleted from server.
      const videoExists = fs.existsSync(`${videoDirectory}/${video?.path}`);
      assert.isFalse(videoExists);

      // checking if video is deleted in database.
      video = await Video.findByPk(video?.id);
      assert.isNull(video);
    });

    it('returns not found error if video with given id does not exist.', async () => {
      /** Calling API to delete video. */
      const videoDeleteResponse = await app.delete(
        `/admin/videos/1111111111111111111`
      );
      assert.equal(videoDeleteResponse.status, 404);
    });
  });
});
