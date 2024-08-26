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
exports.GetOneChatById = exports.GetAllChatsByUserId = exports.GetAllChats = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Récup tous les chats
 * @returns
 */
const GetAllChats = () => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield prisma.chat.findMany({
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
        (0, customErrors_1.NoContent)();
    }
    return chats;
});
exports.GetAllChats = GetAllChats;
/**
 *
 * @returns
 */
const GetAllChatsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield prisma.chat.findMany({
        where: {
            OR: [
                { requesterId: userId },
                { responderId: userId }
            ]
        },
        include: {
            request: {
                include: {
                    user: true // Inclure les détails de l'utilisateur qui a créé la demande
                }
            },
            response: {
                include: {
                    user: true // Inclure les détails de l'utilisateur qui a répondu à la demande
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
        (0, customErrors_1.NoContent)();
    }
    // Enrichir les chats avec les informations de l'interlocuteur
    const enrichedChats = chats.map(chat => {
        // Déterminer si l'utilisateur actuel est le demandeur ou le répondant
        const isRequester = chat.requesterId === userId;
        const interlocutor = isRequester ? chat.response.user : chat.request.user;
        const interlocutorId = isRequester ? chat.responderId : chat.requesterId;
        return Object.assign(Object.assign({}, chat), { interlocutorId, // ID de l'interlocuteur
            interlocutor // Informations complètes de l'interlocuteur
         });
    });
    return enrichedChats;
    // return { chats };
    // return { chats, request: requests, response: response, };
});
exports.GetAllChatsByUserId = GetAllChatsByUserId;
/**
 * Récupère le chat par son id
 * @param chatId
 * @returns
 */
const GetOneChatById = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });
    if (!chat) {
        (0, customErrors_1.notFoundError)("Chat not found");
    }
    return chat;
});
exports.GetOneChatById = GetOneChatById;
