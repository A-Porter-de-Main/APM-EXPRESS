import { Request, Response, NextFunction } from 'express';
import { GetAllSkills, GetOneSkilltById } from '../services/skill.services';


//Get
export const GetSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await GetAllSkills();
    return res.status(200).json(skills);
  } catch (e) {
    next(e)
  }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const skill = await GetOneSkilltById(id);
    return res.status(200).json(skill);
  } catch (e) {
    next(e)
  }
}
