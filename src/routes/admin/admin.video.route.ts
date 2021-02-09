import { Router } from 'express';
import { createVideo } from '@controllers/admin/video/admin.video.controller';
import { createValidation, videoUploadValidation } from '@controllers/admin/video/admin.video.validation';

const router = Router();

router.post('/', videoUploadValidation, createValidation, createVideo);

export default router;