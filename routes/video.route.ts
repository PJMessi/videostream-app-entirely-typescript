import { Router } from 'express';
import { createVideo, fetchVideo, paginateVideos } from '#root/controllers/video/video.controller';
import { createValidation, paginateValidation } from '#root/controllers/video/video.validation';
import authMiddleware from '#root/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, paginateValidation, paginateVideos);
router.post('/', authMiddleware, createValidation, createVideo);
router.get('/:videoId', authMiddleware, fetchVideo);

export default router;