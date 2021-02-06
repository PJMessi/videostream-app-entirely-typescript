import { Router } from 'express';
import { createVideo, fetchVideo, paginateVideos } from '#root/controllers/video/video.controller';
import { createValidation, paginateValidation } from '#root/controllers/video/video.validation';

const router = Router();

router.get('/', paginateValidation, paginateVideos);
router.post('/', createValidation, createVideo);
router.get('/:videoId', fetchVideo);

export default router;