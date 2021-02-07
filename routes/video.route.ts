import { Router } from 'express';
import { createVideo, fetchVideo, paginateVideos } from '@controllers/video/video.controller';
import { createValidation, paginateValidation } from '@controllers/video/video.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, paginateValidation, paginateVideos);
router.post('/', authMiddleware, createValidation, createVideo);
router.get('/:videoId', authMiddleware, fetchVideo);

export default router;