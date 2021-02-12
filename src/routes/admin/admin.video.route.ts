import { Router } from 'express';
import { store } from '@controllers/admin/video/admin.video.controller';
import { storeValidation, videoUploadValidation } from '@controllers/admin/video/admin.video.validation';

const router = Router();

router.post('/', videoUploadValidation, storeValidation, store);

export default router;