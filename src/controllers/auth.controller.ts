import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { validationResult } from 'express-validator';
import { UserRegistrationDTO, UserTokenInfosDTO } from '../types/user';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { alreadyTakenError, notFoundError } from '../../utils/customErrors';
import { FindRoleId } from '../../utils/findRole';

const prisma = new PrismaClient();

const generateToken = (user: UserTokenInfosDTO) => {
  if (process.env.JWT_SECRET) {
    return jwt.sign(
      { id: user.id, username: user.email },  // Payload
      process.env.JWT_SECRET,                    // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN }  // Options de token
    );
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true
    }
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

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
      updatedAt: user.updatedAt
    },
  });
};
// export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(400).json({ errors: errors.array() });
//       return;
//     }

//     const { firstName, lastName, email, phone, password, picturePath, description } = req.body;

//     const user = await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         description,
//         email,
//         phone,
//         password,
//         stripUserId: undefined,
//         picturePath,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });



//     res.status(201).json({ message: 'User created successfully', user });
//   } catch (error) {
//     next(error);
//   }
// };

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firstName, lastName, description, email, phone, password, stripeUserId, picturePath } = req.body;

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
        picturePath,
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