"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessage = exports.GetOneMessageById = exports.GetAllMessages = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const __1 = require("..");
const prisma = new client_1.PrismaClient();
/**
 * Récup tous les messages
 * @returns
 */
const GetAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma.message.findMany();
    if (!messages || messages.length <= 0) {
        (0, customErrors_1.NoContent)();
    }
    return messages;
});
exports.GetAllMessages = GetAllMessages;
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
const GetOneMessageById = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma.chat.findUnique({
        where: { id: messageId },
        include: {
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
    if (!chat) {
        (0, customErrors_1.notFoundError)("Chat not found");
    }
    return chat;
});
exports.GetOneMessageById = GetOneMessageById;
//Todo: fais le create Message et test
const CreateMessage = (requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, content, senderId, receiverId } = requestDto;
        const createdMsg = yield prisma.message.create({
            data: {
                chatId,
                senderId,
                receiverId,
                content,
                createdAt: new Date().toISOString()
            },
        });
        __1.io.to(`chat_${chatId}`).emit('newMessage', { chatId: chatId, senderId: senderId, receiverId: receiverId, content: content, createdAt: createdMsg.createdAt, id: createdMsg.id });
        return createdMsg;
    }
    catch (e) {
        throw e;
    }
});
exports.CreateMessage = CreateMessage;
