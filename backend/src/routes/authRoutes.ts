import { Router } from 'express';
import { AuthController, registerValidation, loginValidation } from '../controllers/authController';

const router = Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

export default router;

