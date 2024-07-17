import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { UserLoginDTO, UserRegistrationDTO, UserTokenInfosDTO } from '../types/user';
import { alreadyTakenError, badCredentialsError, notFoundError, serverError } from '../../utils/customErrors';
import { CheckExistingField, CheckExistingFieldOrThrow } from '../../utils/checkFields';
import { FindRoleId } from '../../utils/findRole';
import { AddressDTO } from '../types/address';

const prisma = new PrismaClient();

/**
 * Fonction de génération de Token JWT
 * @param user 
 * @returns Un JWT signé avec les informations utilisateurs
 */
export const GenerateToken = (user: UserTokenInfosDTO) => {
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
export const AuthenticateUser = async (credentials: UserLoginDTO) => {
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
    const token = GenerateToken(user as UserTokenInfosDTO);
    return { token, user }

  } catch (e) {
    throw e;
  }
}

/**
 * Fonction de création d'utilisateur avec son Addresse
 * @param userData 
 * @returns 
 */
export const CreateUser = async (userData: UserRegistrationDTO) => {
  try {
    const { firstName, lastName, description, email, phone, password, stripeUserId, picturePath, longitude, latitude, street, zipCode } = userData;
    console.log(userData);

    //Vérifie si Phone et Email existe 
    const isPhoneAlreadyExist = await CheckExistingField("phone", phone);
    const isEmailAlreadyExist = await CheckExistingField("email", email);

    //Récupère le rôle user en bdd
    let findingRole = await FindRoleId("user");
    if (!findingRole) notFoundError("Role");

    const hashedPassword = await bcrypt.hash(password, 10);

    const address: AddressDTO = {
      latitude: typeof latitude != "number" ? parseFloat(latitude) : latitude,
      longitude: typeof longitude != "number" ? parseFloat(longitude) : latitude,
      street: street,
      zipCode: zipCode
    }

    const user: User = await prisma.user.create({
      data: {
        firstName,
        lastName,
        description,
        email,
        phone,
        password: hashedPassword,
        stripeUserId,
        picturePath: picturePath,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: findingRole?.id,
        addresses: {
          create: address
        }
      },
      include: {
        role: true,
        addresses: true,
      }
    });


    const token = GenerateToken(user as UserTokenInfosDTO);

    return { token, user }

  } catch (e) {
    throw e;
  }
}

