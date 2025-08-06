import { Router } from 'express';
import { register,login } from '../controllers/userController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

//todo: implement other known endpoints e.g. forgot-password etc

export default router;