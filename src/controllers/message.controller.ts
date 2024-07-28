import { Request, Response, NextFunction } from 'express';
import { GetAllSkills, GetOneSkilltById } from '../services/skill.services';


//Get
export const GetMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await GetAllSkills();
    return res.status(200).json(messages);
  } catch (e) {
    next(e)
  }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const message = await GetOneSkilltById(id);
    return res.status(200).json(message);
  } catch (e) {
    next(e)
  }
}
