import {Request, Response, NextFunction} from 'express';
import {decode} from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import {disconnectPrisma} from '../utils/disconnectPrismaClient';

const prisma = new PrismaClient();

export function authHandler(roles: string[]): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
      try {

    //Récup la requete avec le bearer
    let authBearer = req.headers.authorization?.split("Bearer ")[1];

        if (!authBearer) return res.status(401).end();

        let token: any = decode(authBearer)

    console.log("token: ", token)

        if (!token) return res.status(401).end();

    // const existngUser = await prisma.user.findUnique({where: {email: token.email}})
        const existngUser = await prisma.user.findUnique({where: {email: token.email}})
       if (roles.includes(token.role) && existngUser) {
            next();
        } else {
            return res.status(401).end();
        }
} catch (e) {
    next(e)
    }

    }


}



