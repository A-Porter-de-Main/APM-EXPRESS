import { PrismaClient } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';

const prisma = new PrismaClient();

/**
 * Récup tous les messages
 * @returns 
 */
export const GetAllMessages = async () => {

  const messages = await prisma.message.findMany();

  if (!messages || messages.length <= 0) {
    NoContent();
  }
  return messages;
}

// //J'essaye de retourner tous les chat avec le 1er message a travers les messages
// export const GetAllMessagesGroupBy = async () => {

//   const messages = await prisma.message.groupBy({
//     by: ["chatId"],
//   });

//   if (!messages || messages.length <= 0) {
//     NoContent();
//   }
//   return messages;
// }

/**
 * Récupère le chat par son id
 * @param chatId 
 * @returns 
 */
export const GetOneMessageById = async (messageId: string) => {

  const chat = await prisma.chat.findUnique({
    where: { id: messageId },
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!chat) {
    notFoundError("Chat not found");
  }
  return chat;
}


// export const CreateMessage = async (requestDto: RequestRegistrationDTO) => {
//   try {
//     const { description, deadline, skills, userId, photos } = requestDto;

//     let picturesData: any = [];
//     //Vérifie si il existe un seul ou plusieurs photos ou pas de photos
//     if (Array.isArray(photos)) {
//       picturesData = photos.map(item => ({
//         picturePath: item.path
//       }));
//     } else if (photos && typeof photos === 'object') {
//       picturesData = [{ picturePath: photos.path }]
//     }


//     //Récupère status open
//     const openStatus = await prisma.requestStatus.findUnique({ where: { code: "OPN" } })
//     if (!openStatus) return badRequestError("Open status don't exist");

//     return await prisma.request.create({
//       data: {
//         description,
//         userId,
//         deadline,
//         statusId: openStatus.id,
//         pictures: {
//           create: picturesData
//         },
//         skills: {
//           create: {
//             skill: { connect: { id: skills } }
//           }
//         }

//       },
//       include: {
//         skills: true,
//         pictures: true,
//         responses: true
//       }
//     });
//   } catch (e) {
//     throw e;
//   }
// }