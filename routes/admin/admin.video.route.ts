import { Router } from 'express';
import { createVideo } from '@controllers/admin/video/admin.video.controller';
import { createValidation } from '@root/controllers/admin/video/admin.video.validation';

const router = Router();

router.post('/', createValidation, createVideo);

export default router;