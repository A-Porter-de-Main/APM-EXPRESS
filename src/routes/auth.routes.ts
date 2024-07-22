import {Router} from 'express';
import {Login, Register, test} from '../controllers/auth.controller';
import {userLoginSchema, userRegistrationSchema} from '../../validators/auth.validator';
import {authHandler} from '../../middlewares/authMiddlewares';
import upload from '../../config/multer';
import {validateData} from '../../middlewares/validatorMiddlewares';

const authRouter = Router();

authRouter.post('/login', validateData(userLoginSchema), Login);
authRouter.post('/register', upload.single("photo"), validateData(userRegistrationSchema), Register);

export default authRouter;
