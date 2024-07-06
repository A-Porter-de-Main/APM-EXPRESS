import { Router } from 'express';
import { login, register, test } from '../controllers/auth.controller';
import { authSignUpValidator, authValidator } from '../../validators/auth.validator';
import { authHandler } from '../../middlewares/authMiddlewares';

const authRouter = Router();

authRouter.post('/login', authValidator, login);
authRouter.post('/register', authSignUpValidator, register);
authRouter.get('/test', authHandler(["otrerole", "admin"]), test);

export default authRouter;
