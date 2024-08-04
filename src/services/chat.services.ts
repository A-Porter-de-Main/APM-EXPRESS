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
      }
    }
  });
  // const chats = await prisma.chat.groupBy({
  //   by: [""]
  // });
  // include: {
  //   messages: {
  //     take: 1,
  //     orderBy: {
  //       createdAt: 'desc'
  //     }
  //   }
  // }

  if (!chats || chats.length <= 0) {
    NoContent();
  }
  return chats;
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

