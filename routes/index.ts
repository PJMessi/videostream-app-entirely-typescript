import { NextFunction, Request, Response, Router } from 'express';
import { Video } from '../database/models/video.model';

const router = Router();

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

export default router;