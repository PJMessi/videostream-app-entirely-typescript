import { Router } from 'express';
import {
  show,
  paginate,
  stream,
} from '@controllers/user/video/video.controller';
import {
  paginateValidation,
  streamValidation,
} from '@controllers/user/video/video.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, paginateValidation, paginate);
router.get('/:videoId', authMiddleware, show);
router.get('/:videoId/stream', authMiddleware, streamValidation, stream);

export default router;
