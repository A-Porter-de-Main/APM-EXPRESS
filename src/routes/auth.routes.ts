import { Router } from 'express';
<<<<<<< HEAD
import { Login, Register, test } from '../controllers/auth.controller';
import { userLoginSchema, userRegistrationSchema } from '../../validators/auth.validator';
import { authHandler } from '../../middlewares/authMiddlewares';
import upload from '../../config/multer';
import { validateData } from '../../middlewares/validatorMiddlewares';

const authRouter = Router();

authRouter.post('/login', validateData(userLoginSchema), Login);
authRouter.post('/register', upload.single("photo"), validateData(userRegistrationSchema), Register);


// authRouter.get('/test', authHandler(["otrerole", "admin"]), test);

export default authRouter;

=======
import { login, register, test } from '../controllers/auth.controller';
import { authSignUpValidator, authValidator } from '../../validators/auth.validator';
import { authHandler } from '../../middlewares/authMiddlewares';

const authRouter = Router();

authRouter.post('/login', authValidator, login);
authRouter.post('/register', authSignUpValidator, register);
authRouter.get('/test', authHandler(["otrerole", "admin"]), test);

export default authRouter;
>>>>>>> feature/demande
