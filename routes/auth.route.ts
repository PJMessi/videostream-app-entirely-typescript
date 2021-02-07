import { Router } from 'express';
import { login, profile, register } from '@controllers/auth/auth.controller';
import { loginValidation, registerValidation } from '@controllers/auth/auth.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/profile', authMiddleware, profile);

export default router;