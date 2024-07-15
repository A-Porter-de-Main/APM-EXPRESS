import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRegistrationDTO, UserTokenInfosDTO } from '../types/user';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { alreadyTakenError, notFoundError } from '../../utils/customErrors';
import { FindRoleId } from '../../utils/findRole';

const prisma = new PrismaClient();


/**
 * Fonction de génération de Token JWT
 * @param user 
 * @returns Un JWT signé avec les informations utilisateurs
 */
const generateToken = (user: UserTokenInfosDTO) => {
  if (process.env.JWT_SECRET) {
    return jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, role: user.role.name },  // Payload
      process.env.JWT_SECRET,                    // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN }  // Options de token
    );
  }
};


/**
 * Fonction de connexion
 * @param req 
 * @param res 
 * @returns Json
 */
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


/**
 * Fonction d'inscription
 * @param req 
 * @param res 
 * @param next 
 */

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // let err = validationResult(req);
    // console.log("les erreurs: ", err)

    // if (!err.isEmpty()) {
    //   return res.status(400).json({ message: "Input is missing" })
    // }

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

// router.post('/register', upload.single('profilePicture'), async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Récupérer les données de l'utilisateur depuis req.body
//     const { username, email, password } = req.body;

//     // Récupérer le chemin du fichier téléchargé depuis req.file
//     const profilePicture = req.file ? req.file.path : null;

//     // Exemple de traitement des données et d'enregistrement dans une base de données
//     // Remplacez ceci par votre propre logique de sauvegarde
//     // const newUser = new User({ username, email, password, profilePicture });
//     // await newUser.save();

//     res.status(201).send({
//       message: 'Utilisateur enregistré avec succès',
//       data: { username, email, profilePicture }
//     });
//   } catch (error) {
//     next(error);
//   }
// });