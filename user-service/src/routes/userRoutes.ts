import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, UserController.register);
router.post('/login', validateLogin, UserController.login);

export default router;