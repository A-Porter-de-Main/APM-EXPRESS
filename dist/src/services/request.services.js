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
exports.DeleteRequest = exports.PostRequest = exports.GetOneRequestById = exports.GetAllRequest = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const checkFields_1 = require("../../utils/checkFields");
const prisma = new client_1.PrismaClient();
/**
 * Récup toute les demandes
 * @returns
 */
const GetAllRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield prisma.request.findMany();
        if (!requests || requests.length <= 0) {
            (0, customErrors_1.NoContent)();
        }
        return requests;
    }
    catch (e) {
        throw e;
    }
});
exports.GetAllRequest = GetAllRequest;
/**
 * Récupère la demande par son id
 * @param requestId
 * @returns
 */
const GetOneRequestById = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield prisma.request.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            (0, customErrors_1.notFoundError)("Request not found");
        }
        return request;
    }
    catch (e) {
        throw e;
    }
});
exports.GetOneRequestById = GetOneRequestById;
const PostRequest = (requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, deadline, skills, userId } = requestDto;
        //Check si l'user existe
        const isUserExist = yield (0, checkFields_1.CheckExistingFieldOrThrow)("id", userId);
        //Check si tous les ids des skills existes ?
        const requestCreated = yield prisma.request.create({
            data: {
                description,
                userId,
                deadline,
                skills: {
                    create: skills.map(skillId => ({
                        skill: { connect: { id: skillId } }
                    }))
                }
            }
        });
        if (!requestCreated) {
            (0, customErrors_1.notFoundError)("Request not found");
        }
        return requestCreated;
    }
    catch (e) {
        throw e;
    }
});
exports.PostRequest = PostRequest;
// export const PacthRequest = async (requestId: string) => {
//   try {
//     const request = await prisma.request.create({
//       data: {
//       }
//     })
//     if (!request) {
//       notFoundError("Request not found");
//     }
//     return request;
//   } catch (e) {
//     throw e;
//   }
// }
/**
 * Supprime la demande avec son id
 * @param requestId
 * @returns
 */
const DeleteRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRequest = (0, checkFields_1.checkExistingFieldRequestOrThrow)("id", requestId);
        if (!existingRequest)
            (0, customErrors_1.notFoundError)("Request not found");
        const request = yield prisma.request.delete({
            where: {
                id: requestId
            }
        });
        return request;
    }
    catch (e) {
        throw e;
    }
});
exports.DeleteRequest = DeleteRequest;
