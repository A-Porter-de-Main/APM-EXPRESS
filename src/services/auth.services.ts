import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { UserLoginDTO, UserRegistrationDTO, UserTokenInfosDTO } from '../types/user';
import { badCredentialsError, serverError } from '../../utils/customErrors';
import { disconnectPrisma } from '../../utils/disconnectPrismaClient';

const prisma = new PrismaClient();

/**
 * Fonction de génération de Token JWT
 * @param user 
 * @returns Un JWT signé avec les informations utilisateurs
 */
export const generateToken = (user: UserTokenInfosDTO) => {
  if (process.env.JWT_SECRET) {
    return jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, role: user.role.name },  // Payload
      process.env.JWT_SECRET,                    // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN }  // Options de token
    );
  }
};



/**
 * Fonction de login
 * @param credentials 
 * @returns 
 */
export const authenticateUser = async (credentials: UserLoginDTO) => {
  try {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      badCredentialsError("Email or Password invalid");
    }

    const token = generateToken(user as UserTokenInfosDTO);

    return { token, user }

  } catch (e) {
    throw e;
  }
}

