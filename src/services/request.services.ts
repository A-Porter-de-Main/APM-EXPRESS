import { PrismaClient, User } from '@prisma/client';
import { badRequestError, NoContent, notFoundError } from '../../utils/customErrors';
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

    //Vérifie si il existe un seul ou plusieurs photos ou pas de photos
    if (Array.isArray(photos)) {
      picturesData = photos.map(item => ({
        picturePath: item.path
      }));
    } else if (photos && typeof photos === 'object') {
      picturesData = [{ picturePath: photos.path }]
    }

    //Récupère status open
    const openStatus = await prisma.requestStatus.findUnique({ where: { code: "OPN" } })
    if (!openStatus || openStatus === null) return badRequestError("Open status don't exist");

    const requestCreated = await prisma.request.create({
      data: {
        description,
        userId,
        deadline,
        statusId: openStatus.id,
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

export const UpdateRequest = async (requestId: string, requestDto: Partial<RequestRegistrationDTO>) => {
  try {
    const { description, deadline, skills, userId, photos, statusId } = requestDto;

    let picturesData: any = [];

    // Vérifie si il existe un seul ou plusieurs photos ou pas de photos
    if (Array.isArray(photos)) {
      picturesData = photos.map(item => ({
        picturePath: item.path
      }));
    } else if (photos && typeof photos === 'object') {
      picturesData = [{ picturePath: photos.path }];
    }


    const dataToUpdate: any = {
      description,
      deadline,
      userId,
      statusId
    };

    if (picturesData.length > 0) {
      dataToUpdate.pictures = {
        deleteMany: {},
        create: picturesData
      };
    }

    if (skills && skills.length > 0) {
      dataToUpdate.skills = {
        deleteMany: {},
        create: skills.map(skillId => ({
          skill: { connect: { id: skillId } }
        }))
      };
    }

    const requestUpdated = await prisma.request.update({
      where: { id: requestId },
      data: dataToUpdate,
      include: {
        skills: true,
        pictures: true,
      }
    });

    return requestUpdated;
  } catch (e) {
    throw e;
  }
};


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
