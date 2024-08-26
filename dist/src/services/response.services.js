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
exports.DeleteResponse = exports.UpdateResponse = exports.CreateResponse = exports.GetOneResponsetById = exports.GetAllResponse = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Récup toute les réponses
 * @returns
 */
const GetAllResponse = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.response.findMany();
        if (!response || response.length <= 0) {
            (0, customErrors_1.NoContent)();
        }
        return response;
    }
    catch (e) {
        throw e;
    }
});
exports.GetAllResponse = GetAllResponse;
/**
 * Récupère la réponse par son id
 * @param responsetId
 * @returns
 */
const GetOneResponsetById = (responseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.response.findUnique({
            where: { id: responseId },
            include: {
                user: true,
                request: true,
                chat: true
            }
        });
        if (!response) {
            (0, customErrors_1.notFoundError)("Request not found");
        }
        return response;
    }
    catch (e) {
        throw e;
    }
});
exports.GetOneResponsetById = GetOneResponsetById;
const CreateResponse = (requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, requestId } = requestDto;
        let options;
        //ICI, vérifier que la demande ne dispose pas déjà d'une response avec le meme user id
        //PUIS, vérifier si il existe déjà un chat entre les deux users si oui, ne rien faire sinon en créer un 
        const request = yield prisma.request.findUnique({ where: { id: requestId } });
        if (!request || request === null)
            return (0, customErrors_1.notFoundError)("Request Not Found");
        const existingChat = yield prisma.chat.findFirst({
            where: {
                requestId: requestId, response: {
                    userId: userId
                }
            }
        });
        const exsitingResponse = yield prisma.response.findFirst({ where: { userId: userId, requestId: requestId } });
        // if(!existingChat) 
        if (exsitingResponse)
            (0, customErrors_1.badRequestError)("User have already response to this request");
        if (!existingChat) {
            options = {
                chat: {
                    create: {
                        requestId: requestId,
                        requesterId: request.userId,
                        responderId: userId
                    }
                }
            };
        }
        const responseCreated = yield prisma.response.create({
            data: Object.assign({ userId,
                requestId }, options),
            include: {
                user: true,
                request: true,
                chat: true
            }
        });
        return responseCreated;
    }
    catch (e) {
        throw e;
    }
});
exports.CreateResponse = CreateResponse;
const UpdateResponse = (responseId, requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseUpdated = yield prisma.response.update({
            where: { id: responseId },
            data: requestDto,
            include: {
                user: true,
                request: true,
            }
        });
        return responseUpdated;
    }
    catch (e) {
        throw e;
    }
});
exports.UpdateResponse = UpdateResponse;
/**
 * Supprime la response avec son id
 * @param requestId
 * @returns
 */
const DeleteResponse = (responseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.response.delete({
            where: {
                id: responseId
            }
        });
        return response;
    }
    catch (e) {
        throw e;
    }
});
exports.DeleteResponse = DeleteResponse;
