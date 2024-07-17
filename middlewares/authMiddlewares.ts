import {Request, Response, NextFunction} from 'express';
import {decode} from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import {disconnectPrisma} from '../utils/disconnectPrismaClient';

const prisma = new PrismaClient()

export function authHandler(roles: string[]): (req: Request, res: Response, next: NextFunction) => void {
<<<<<<< HEAD
  return async (req: Request, res: Response, next: NextFunction) => {

    //Récup la requete avec le bearer
    let authBearer = req.headers.authorization?.split("Bearer ")[1];
=======
    return async (req: Request, res: Response, next: NextFunction) => {
        //Récup la requete avec le bearer
        console.log("T'es qui grooos ? : ")

        let authBearer = req.headers.authorization?.split("Bearer ")[1];
>>>>>>> feature/demande

        console.log("C'est toi le auth bearer ? : ", authBearer)

        if (!authBearer) return res.status(401).end();

        let token: any = decode(authBearer)

        if (!token) return res.status(401).end();
        console.log("Decodeur: ", token)


        const existngUser = await prisma.user.findUnique({where: {id: token.id}})


<<<<<<< HEAD
=======
        await disconnectPrisma(prisma)

>>>>>>> feature/demande

        if (roles.includes(token.role) && existngUser) {
            next();
        } else {
            return res.status(401).end();
        }
    }

}



