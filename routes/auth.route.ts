import { Router } from 'express';
import { login, register } from '#root/controllers/auth/auth.controller';
import { loginValidation, registerValidation } from '#root/controllers/auth/auth.validation';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

export default router;