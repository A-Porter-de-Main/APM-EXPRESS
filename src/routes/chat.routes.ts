import {Router} from 'express';
import {authHandler} from '../../middlewares/authMiddlewares';
import {GetChatByUserId, GetChats, GetOneById} from '../controllers/chat.controller';

const chatRouter = Router();

chatRouter.get('/', authHandler(["admin", "user"]), GetChats);
chatRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);
chatRouter.get('/my/:userId', authHandler(["admin", "user"]), GetChatByUserId);


export default chatRouter;

