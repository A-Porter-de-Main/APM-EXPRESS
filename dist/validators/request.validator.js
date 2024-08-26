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
exports.patchRequestSchema = exports.deleteRequestSchema = exports.createRequestSchema = void 0;
const zod_1 = require("zod");
const checkFields_1 = require("../utils/checkFields");
exports.createRequestSchema = zod_1.z.object({
    description: zod_1.z.string().min(1),
    deadline: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "user");
        if (!existingUser) {
            ctx.addIssue({
                code: "custom",
                message: "User does not exist",
                path: ["userId"]
            });
        }
    })),
    skills: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const undefinedSkillsIdArray = [];
        const existingSkills = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "skill");
        if (!existingSkills)
            undefinedSkillsIdArray.push(val);
        if (undefinedSkillsIdArray.length > 0) {
            ctx.addIssue({
                code: "custom",
                message: "doesn't exist",
                path: ["skill"]
            });
        }
    }))
});
/**
 * Schéma de validation pour la suppression d'une requête, vérifie que l'id user en params existe
 */
exports.deleteRequestSchema = zod_1.z.object({
    id: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "request");
        if (!existingUser) {
            ctx.addIssue({
                code: "custom",
                message: "Request does not exist",
                path: ["id"]
            });
        }
    })),
});
/**
 * Schéma de validation pour le patch
 */
exports.patchRequestSchema = zod_1.z.object({
    id: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "request");
        if (!existingUser) {
            ctx.addIssue({
                code: "custom",
                message: "Request does not exist",
                path: ["id"]
            });
        }
    })),
});
