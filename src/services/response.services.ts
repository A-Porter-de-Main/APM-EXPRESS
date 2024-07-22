import { PrismaClient, User } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';
import { ResponseRegistrationDTO } from '../types/response';

const prisma = new PrismaClient();

/**
 * Récup toute les réponses
 * @returns 
 */
export const GetAllResponse = async () => {
  try {
    const response = await prisma.response.findMany();

    if (!response || response.length <= 0) {
      NoContent();
    }

    return response;
  } catch (e) {
    throw e;
  }
}

/**
 * Récupère la réponse par son id
 * @param responsetId 
 * @returns 
 */
export const GetOneResponsetById = async (responseId: string) => {
  try {
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        user: true,
        request: true
      }
    })

    if (!response) {
      notFoundError("Request not found");
    }
    return response;
  } catch (e) {
    throw e;
  }
}


export const CreateResponse = async (requestDto: ResponseRegistrationDTO) => {
  try {
    const { userId, requestId } = requestDto;

    const responseCreated = await prisma.response.create({
      data: {
        userId,
        requestId
      },
      include: {
        user: true,
        request: true,
      }
    })

    return responseCreated;
  } catch (e) {
    throw e;
  }
}

export const UpdateResponse = async (responseId: string, requestDto: Partial<ResponseRegistrationDTO>) => {
  try {

    const responseUpdated = await prisma.response.update({
      where: { id: responseId },
      data: requestDto,
      include: {
        user: true,
        request: true,
      }
    });

    return responseUpdated;
  } catch (e) {
    throw e;
  }
};


/**
 * Supprime la response avec son id
 * @param requestId 
 * @returns 
 */
export const DeleteResponse = async (responseId: string) => {
  try {

    const response = await prisma.response.delete({
      where: {
        id: responseId
      }
    })


    return response;
  } catch (e) {
    throw e;
  }
}
