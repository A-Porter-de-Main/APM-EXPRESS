import { Router } from 'express';
import { login, register, test } from '../controllers/auth.controller';
import { userLoginSchema, userRegistrationSchema } from '../../validators/auth.validator';
import { authHandler } from '../../middlewares/authMiddlewares';
import upload from '../../config/multer';
import { validateData } from '../../middlewares/validatorMiddlewares';

const authRouter = Router();

authRouter.post('/login', validateData(userLoginSchema), login);
authRouter.post('/register', upload.single("photo"), validateData(userRegistrationSchema), register);


authRouter.get('/test', authHandler(["otrerole", "admin"]), test);

export default authRouter;

