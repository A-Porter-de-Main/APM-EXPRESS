import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import { GetOneById, GetSkills } from '../controllers/skill.controller';
import { GetChats } from '../controllers/chat.controller';
const chatRouter = Router();

chatRouter.get('/', authHandler(["admin", "user"]), GetChats);
chatRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);


export default chatRouter;
