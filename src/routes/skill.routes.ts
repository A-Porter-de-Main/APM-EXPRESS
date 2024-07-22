import { Router } from 'express';
import { authHandler } from '../../middlewares/authMiddlewares';
import { GetOneById, GetSkills } from '../controllers/skill.controller';
const skill = Router();

skill.get('/', authHandler(["admin", "user"]), GetSkills);
skill.get('/:id', authHandler(["admin", "user"]), GetOneById);


export default skill;
