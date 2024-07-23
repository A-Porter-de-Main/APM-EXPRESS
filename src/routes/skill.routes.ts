import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import { GetOneById, GetSkills } from '../controllers/skill.controller';
const skillRouter = Router();

skillRouter.get('/', authHandler(["admin", "user"]), GetSkills);
skillRouter.get('/:id', authHandler(["admin", "user"]), GetOneById);


export default skillRouter;
