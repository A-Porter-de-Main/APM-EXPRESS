import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import { PostMessage, GetOneById, GetMessages } from '../controllers/message.controller';
import { createMessageSchema } from '../../validators/message.validator';
import { validateDataAsync } from '../../middlewares/validatorMiddlewares';

const messageRouter = Router();

messageRouter.get('/', authHandler(["admin", "user"]), GetMessages);
messageRouter.get('/:id', authHandler(["admin", "user"]), GetOneById); //ajoute un validate param Url
messageRouter.post('/', authHandler(["admin", "user"]), validateDataAsync(createMessageSchema), PostMessage);


export default messageRouter;