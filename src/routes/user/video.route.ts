import { Router } from 'express';
import { show, paginate } from '@controllers/user/video/video.controller';
import { paginateValidation } from '@controllers/user/video/video.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, paginateValidation, paginate);
router.get('/:videoId', authMiddleware, show);

export default router;