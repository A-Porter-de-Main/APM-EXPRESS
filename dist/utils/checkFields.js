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
exports.checkExistingFieldRequestOrThrow = exports.CheckExistingFieldOrThrow = exports.CheckExistingField = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("./customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Fonction qui vérifie si un champ exitse model User (pour vérifier les champs unqiue) et si oui alors throw une Erreur
 * @param field
 * @param value
 */
const CheckExistingField = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield prisma.user.findFirst({
            where: {
                [field]: value
            }
        });
        if (existingUser) {
            (0, customErrors_1.alreadyTakenError)(field);
        }
    }
    catch (e) {
        throw e;
    }
});
exports.CheckExistingField = CheckExistingField;
/**
 * Fonction pour vérifier si un champ existe model User (pour les user id par exemple)
 * @param field
 * @param value
 * @returns
 */
const CheckExistingFieldOrThrow = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield prisma.user.findFirst({
            where: {
                [field]: value
            }
        });
        if (!existingUser) {
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
});
exports.CheckExistingFieldOrThrow = CheckExistingFieldOrThrow;
/**
 * Recherche les champs existant pour le model Request
 * @param model
 * @param field
 * @param value
 * @returns
 */
const checkExistingFieldRequestOrThrow = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRequest = yield prisma.user.findFirst({
            where: {
                [field]: value
            }
        });
        if (!existingRequest) {
            return false;
        }
        return true;
    }
    catch (e) {
        throw e;
    }
});
exports.checkExistingFieldRequestOrThrow = checkExistingFieldRequestOrThrow;
