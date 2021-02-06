import { Router } from 'express';
import { login, profile, register } from '#root/controllers/auth/auth.controller';
import { loginValidation, registerValidation } from '#root/controllers/auth/auth.validation';
import authMiddleware from '#root/middlewares/auth.middleware';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/profile', authMiddleware, profile);

export default router;