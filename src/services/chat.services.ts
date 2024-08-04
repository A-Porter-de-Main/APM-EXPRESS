import { PrismaClient } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';

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
      request: {
        select: { user: true },
        include: {
          user: true
        }
      }
    }
  });


  if (!chats || chats.length <= 0) {
    NoContent();
  }
  return chats;
}

/**
 * 
 * @returns 
 */
export const GetAllChatsByUserId = async (userId: string) => {

  //récupérer toutes les requêtes et demandes du type

  const requests = await prisma.request.findMany({
    where: {
      userId,
    },
    select: {
      id: true
    }

  })

  const requestIds = requests.map(item => item.id);

  const response = await prisma.response.findMany({
    where: {
      userId,
    },
    select: {
      id: true
    }
  })

  const responseIds = response.map(item => item.id);


  // aller les chercher par ça

  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        {
          requestId: { in: requestIds }
        },
        {
          responseId: { in: responseIds }
        },
      ]

    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      request: {
        select: { user: true },

      }
    }
  });


  if (!chats || chats.length <= 0) {
    NoContent();
  }

  return { chats };
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
          createdAt: "desc"
        }
      }
    }

  })

  if (!chat) {
    notFoundError("Chat not found");
  }
  return chat;
}

