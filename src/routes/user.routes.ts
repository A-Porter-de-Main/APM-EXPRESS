import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/users', createUser);
userRouter.get('/users/:id', getUser);
userRouter.put('/users/:id', updateUser);
userRouter.delete('/users/:id', deleteUser);

export default userRouter;
