import { PrismaClient, User } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';
import { RequestRegistrationDTO } from '../types/request';

const prisma = new PrismaClient();

/**
 * Récup toute les demandes
 * @returns 
 */
export const GetAllRequest = async () => {
  try {
    const requests = await prisma.request.findMany();

    if (!requests || requests.length <= 0) {
      NoContent();
    }

    return requests;
  } catch (e) {
    throw e;
  }
}

/**
 * Récupère la demande par son id
 * @param requestId 
 * @returns 
 */
export const GetOneRequestById = async (requestId: string) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        user: true,
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!request) {
      notFoundError("Request not found");
    }
    return request;
  } catch (e) {
    throw e;
  }
}

//Mettre une validation sur les request ( dont les skills au mooins 1 valide puis aussi verifier le userId qu'il soit valide)

export const CreateRequest = async (requestDto: RequestRegistrationDTO) => {
  try {
    const { description, deadline, skills, userId, photos } = requestDto;

    let picturesData: any = [];

    if (Array.isArray(photos)) {
      // Si photos est un tableau de fichiers
      picturesData = photos.map(item => ({
        picturePath: item.path
      }));
    } else if (photos && typeof photos === 'object') {
      picturesData = [{ picturePath: photos.path }]
    }

    const requestCreated = await prisma.request.create({
      data: {
        description,
        userId,
        deadline,
        pictures: {
          create: picturesData
        },
        skills: {
          create: skills.map(skillId => ({
            skill: { connect: { id: skillId } }
          }))
        }
      },
      include: {
        skills: true,
        pictures: true,
      }
    })

    return requestCreated;
  } catch (e) {
    throw e;
  }
}

// export const PacthRequest = async (requestId: string) => {
//   try {
//     const request = await prisma.request.create({
//       data: {

//       }
//     })

//     if (!request) {
//       notFoundError("Request not found");
//     }
//     return request;""
//   } catch (e) {
//     throw e;
//   }
// }

/**
 * Supprime la demande avec son id
 * @param requestId 
 * @returns 
 */
export const DeleteRequest = async (requestId: string) => {
  try {

    const request = await prisma.request.delete({
      where: {
        id: requestId
      }
    })

    return request;
  } catch (e) {
    throw e;
  }
}
