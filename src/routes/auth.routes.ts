import {Router} from 'express';
import { GetAll, Login, Register, Test } from '../controllers/auth.controller';
import { userLoginSchema, userRegistrationSchema } from '../../validators/auth.validator';
import upload from '../../config/multer';
import {validateData} from '../../middlewares/validatorMiddlewares';
import { authHandler } from '../../middlewares/authMiddlewares';

const authRouter = Router();

authRouter.post('/login', validateData(userLoginSchema), Login);
authRouter.post('/register', upload.single("photo"), validateData(userRegistrationSchema), Register);

authRouter.get("/users", authHandler(["user", "admin"]), GetAll)
authRouter.get("/test", Test)
export default authRouter;
