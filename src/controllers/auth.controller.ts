import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRegistrationDTO, UserTokenInfosDTO } from '../types/user';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { alreadyTakenError, notFoundError, badCredentialsError } from '../../utils/customErrors';
import { FindRoleId } from '../../utils/findRole';
import { authenticateUser, generateToken } from '../services/auth.services';

const prisma = new PrismaClient();

//Todo continuer de remettre dans le service le register + la création d'address le front est OK

/**
 * Fonction de connexion
 * @param req 
 * @param res 
 * @returns Json
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const loggedUser = await authenticateUser({ email, password })
    res.json(loggedUser)
  } catch (e) {
    next(e)
  }
};


/**
 * Fonction d'inscription
 * @param req 
 * @param res 
 * @param next 
 */

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firstName, lastName, description, email, phone, password, stripeUserId } = req.body;
    const profilePicture = req.file ? req.file.path : "/uploads/placeholder.jpg";

    console.log("la photo: ", req.file)
    //Check si phone déjà existant
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: phone
      }
    })
    if (existingPhone) {
      alreadyTakenError("phone")
    }

    //Check si email déjà existant
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (existingEmail) {
      alreadyTakenError("email")
    }  

    let findingRole = await FindRoleId("user")

    if (!findingRole) notFoundError("Role")


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        description,
        email,
        phone,
        password: hashedPassword,
        stripeUserId,
        picturePath: profilePicture,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: findingRole?.id
      },
      include: {
        role: true
      }
    });


    const token = generateToken(user as UserTokenInfosDTO);

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        description: user.description,
        stripeUserId: user.stripeUserId,
        picturePath: user.picturePath,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
        roleId: user.roleId,
      }
    });
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