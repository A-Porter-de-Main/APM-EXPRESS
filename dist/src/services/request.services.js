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
exports.DeleteRequest = exports.UpdateRequest = exports.CreateRequest = exports.GetOneRequestById = exports.GetAllRequest = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Récup toute les demandes
 * @returns
 */
const GetAllRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield prisma.request.findMany({ include: { responses: { include: { user: true } } } });
        if (!requests || requests.length === 0) {
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
            include: {
                user: true,
                skills: {
                    include: {
                        skill: true,
                    }
                },
                responses: {
                    include: {
                        user: true
                    }
                },
            }
        });
        if (!request) {
            return (0, customErrors_1.notFoundError)("Request not found");
        }
        return request;
    }
    catch (e) {
        throw e;
    }
});
exports.GetOneRequestById = GetOneRequestById;
const CreateRequest = (requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, deadline, skills, userId, photos } = requestDto;
        let picturesData = [];
        //Vérifie si il existe un seul ou plusieurs photos ou pas de photos
        if (Array.isArray(photos)) {
            picturesData = photos.map(item => ({
                picturePath: item.path
            }));
        }
        else if (photos && typeof photos === 'object') {
            picturesData = [{ picturePath: photos.path }];
        }
        //Récupère status open
        const openStatus = yield prisma.requestStatus.findUnique({ where: { code: "OPN" } });
        if (!openStatus)
            return (0, customErrors_1.badRequestError)("Open status don't exist");
        return yield prisma.request.create({
            data: {
                description,
                userId,
                deadline,
                statusId: openStatus.id,
                pictures: {
                    create: picturesData
                },
                skills: {
                    create: {
                        skill: { connect: { id: skills } }
                    }
                }
                // skills: {
                //   create: skills.map(skillId => ({
                //     skill: {connect: {id: skillId}}
                //   }))
                // }
            },
            include: {
                skills: true,
                pictures: true,
                responses: true
            }
        });
    }
    catch (e) {
        throw e;
    }
});
exports.CreateRequest = CreateRequest;
const UpdateRequest = (requestId, requestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, deadline, skills, userId, photos, statusId } = requestDto;
        let picturesData = [];
        // Vérifie si il existe un seul ou plusieurs photos ou pas de photos
        if (Array.isArray(photos)) {
            picturesData = photos.map(item => ({
                picturePath: item.path
            }));
        }
        else if (photos && typeof photos === 'object') {
            picturesData = [{ picturePath: photos.path }];
        }
        const dataToUpdate = {
            description,
            deadline,
            userId,
            statusId
        };
        if (picturesData.length > 0) {
            dataToUpdate.pictures = {
                deleteMany: {},
                create: picturesData
            };
        }
        if (skills && skills.length > 0) {
            dataToUpdate.skills = {
                deleteMany: {},
                create: skills.map(skillId => ({
                    skill: { connect: { id: skillId } }
                }))
            };
        }
        return yield prisma.request.update({
            where: { id: requestId },
            data: dataToUpdate,
            include: {
                skills: true,
                pictures: true,
            }
        });
    }
    catch (e) {
        throw e;
    }
});
exports.UpdateRequest = UpdateRequest;
/**
 * Supprime la demande avec son id
 * @param requestId
 * @returns
 */
const DeleteRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.request.delete({
            where: {
                id: requestId
            }
        });
    }
    catch (e) {
        throw e;
    }
});
exports.DeleteRequest = DeleteRequest;
