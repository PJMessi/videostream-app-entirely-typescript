import { Router } from 'express';
import { store } from '@controllers/admin/video/admin.video.controller';
import { createValidation, videoUploadValidation } from '@controllers/admin/video/admin.video.validation';

const router = Router();

router.post('/', videoUploadValidation, createValidation, store);

export default router;