import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { authSignUpValidator, authValidator } from '../../validators/auth.validator';

const authRouter = Router();

authRouter.post('/login', authValidator, login);
authRouter.post('/register', authSignUpValidator, register);

export default authRouter;
