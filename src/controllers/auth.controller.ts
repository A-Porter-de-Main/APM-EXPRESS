import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticateUser, CreateUser, } from '../services/auth.services';

const prisma = new PrismaClient();

/**
 * [POST] Fonction de connexion
 * @param req 
 * @param res 
 * @returns Json
 */
export const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const loggedUser = await AuthenticateUser({ email, password })
    res.json(loggedUser)
  } catch (e) {
    next(e)
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

export const test = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("la fonction trql")
    res.status(200).json({ message: 'tqt fraté' })
  } catch (e) {
    next(e)
  }
}