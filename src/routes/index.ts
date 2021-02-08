import { NextFunction, Request, Response, Router } from 'express';
import videoRouter from './user/video.route';
import authRouter from './user/auth.route';
import adminVideoRouter from './admin/admin.video.route';

const router = Router();

// test route.
router.get('/', async (request: Request, response: Response, next: NextFunction) => {
    try {
        return response.json({
            title: 'Typescript Videostream API.',
            message: 'If you can see this message, the APIs are working fine.'
        });
        
    } catch (error) {
        next(error);
    }

});

// user routes.
router.use('/auth', authRouter);
router.use('/videos', videoRouter);

// admin routes.
router.use('/admin/videos', adminVideoRouter);

export default router;