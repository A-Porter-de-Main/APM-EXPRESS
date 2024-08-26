import {PrismaClient} from '@prisma/client';
import {NoContent, notFoundError} from '../../utils/customErrors';

const prisma = new PrismaClient();

/**
 * Récup tous les chats
 * @returns
 */
export const GetAllChats = async () => {

  const chats = await prisma.chat.findMany({
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      request: true
    }
  });


    if (!chats || chats.length === 0) {
        NoContent();
    }
    return chats;
}

/**
 *
 * @returns
 */
export const GetAllChatsByUserId = async (userId: string) => {


  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { responderId: userId }
      ]
    },
    include: {
      request: {
        include: {
          user: true  // Inclure les détails de l'utilisateur qui a créé la demande
        }
      },
      response: {
        include: {
          user: true  // Inclure les détails de l'utilisateur qui a répondu à la demande
        }
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

    if (!chats || chats.length === 0) {
        NoContent();
    }



  // Enrichir les chats avec les informations de l'interlocuteur
  const enrichedChats = chats.map(chat => {
    // Déterminer si l'utilisateur actuel est le demandeur ou le répondant
    const isRequester = chat.requesterId === userId;
    const interlocutor = isRequester ? chat.response.user : chat.request.user;
    const interlocutorId = isRequester ? chat.responderId : chat.requesterId;

    return {
      ...chat,
      interlocutorId,   // ID de l'interlocuteur
      interlocutor     // Informations complètes de l'interlocuteur
    };
  });

  return enrichedChats;




  // return { chats };
  // return { chats, request: requests, response: response, };
}

/**
 * Récupère le chat par son id
 * @param chatId
 * @returns
 */
export const GetOneChatById = async (chatId: string) => {

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }

    })

    if (!chat) {
        notFoundError("Chat not found");
    }
    return chat;
}



