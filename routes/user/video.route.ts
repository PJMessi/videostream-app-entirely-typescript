import { Router } from 'express';
import { fetchVideo, paginateVideos } from '@controllers/user/video/video.controller';
import { paginateValidation } from '@controllers/user/video/video.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, paginateValidation, paginateVideos);
router.get('/:videoId', authMiddleware, fetchVideo);

export default router;