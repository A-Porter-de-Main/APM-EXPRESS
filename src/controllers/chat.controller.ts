import { Request, Response, NextFunction } from 'express';
import { GetAllSkills, GetOneSkilltById } from '../services/skill.services';
import { GetAllChats, GetOneChatById } from '../services/chat.services';


//Get
export const GetChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await GetAllChats();
    return res.status(200).json(chats);
  } catch (e) {
    next(e)
  }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const chat = await GetOneChatById(id);
    return res.status(200).json(chat);
  } catch (e) {
    next(e)
  }
}
