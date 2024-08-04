import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticateUser, CreateUser, GetAllUsers, } from '../services/auth.services';
import { pusher } from '../../utils/pusher';

const prisma = new PrismaClient();

/**
 * [POST] Fonction de connexion
 * @param req
 * @param res
 * @param next
 * @returns Json
 */
export const Login = async (req: Request, res: Response) : Promise<Response> => {
  try {
    const { email, password } = req.body;
    const loggedUser = await AuthenticateUser({ email, password });
    return res.json(loggedUser);
  } catch (e) {
    // You can also throw the error if you want to handle it somewhere else
    throw e;
  }
};


/**
 * [POST] Inscription utilisateur
 * @param req 
 * @param res 
 * @param next 
 */
export const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, description, email, phone, password, stripeUserId, longitude, latitude, street, zipCode } = req.body;

    //Si pas d'image alors on met l'image placeholder
    const picturePath = req.file ? req.file.path : "/uploads/placeholder.jpg";
    const createdUser = await CreateUser({ firstName, lastName, description, email, phone, password, stripeUserId, longitude, latitude, street, zipCode, picturePath });

    return res.status(201).json(createdUser);
  } catch (e) {
    next(e)
  }
};

export const GetAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await GetAllUsers();
    res.status(200).json(users)
  } catch (e) {
    next(e)
  }
}

export const Test = async (req: Request, res: Response, next: NextFunction) => {
  try {

    pusher.trigger("my-channel", "my-event", {
      message: "hello world"
    });
    res.status(200).json({ message: "c'st cool man" })
  } catch (e) {
    next(e)
  }
}
