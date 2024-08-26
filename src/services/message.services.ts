import { PrismaClient } from '@prisma/client';
import { NoContent, notFoundError } from '../../utils/customErrors';
import { MessageRegistrationDTO } from '../types/message';
import { PusherChat } from '../../utils/pusher';
import { io } from '..';

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

//Todo: fais le create Message et test
export const CreateMessage = async (requestDto: MessageRegistrationDTO) => {
  try {
    const { chatId, content, senderId, receiverId } = requestDto;

    const createdMsg = await prisma.message.create({
      data: {
        chatId,
        senderId,
        receiverId,
        content,
        createdAt: new Date().toISOString()
      },
    });

    io.to(`chat_${chatId}`).emit('newMessage', { chatId: chatId, senderId: senderId, receiverId: receiverId, content: content, createdAt: createdMsg.createdAt, id: createdMsg.id });

    return createdMsg;

  } catch (e) {
    throw e;
  }
}