import {Request, Response, NextFunction} from 'express';
import {GetOneSkilltById} from '../services/skill.services';
import {CreateMessage, GetAllMessages} from '../services/message.services';


//Get
export const GetMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await GetAllMessages();
        return res.status(200).json(messages);
    } catch (e) {
        next(e)
    }
}

//Get One :id
export const GetOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const message = await GetOneSkilltById(id);
        return res.status(200).json(message);
    } catch (e) {
        next(e)
    }
}


//Create
export const PostMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {chatId, content, senderId, receiverId} = req.body;

        const createdMesage = await CreateMessage({chatId, content, senderId, receiverId})

        res.status(201).json(createdMesage);

    } catch (e) {
        next(e)
    }
}