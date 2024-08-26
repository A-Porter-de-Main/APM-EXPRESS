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
exports.patchResponseSchema = exports.deleteResponseSchema = exports.createResponseSchema = void 0;
const zod_1 = require("zod");
const checkFields_1 = require("../utils/checkFields");
exports.createResponseSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "user");
        if (!existing) {
            ctx.addIssue({
                code: "custom",
                message: "User does not exist",
                path: ["userId"]
            });
        }
    })),
    requestId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "request");
        if (!existing) {
            ctx.addIssue({
                code: "custom",
                message: "Request does not exist",
                path: ["requestId"]
            });
        }
    })),
});
/**
 * Schéma de validation pour la suppression d'une response, vérifie que l'id response en params existe
 */
exports.deleteResponseSchema = zod_1.z.object({
    id: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "response");
        if (!existing) {
            ctx.addIssue({
                code: "custom",
                message: "Response does not exist",
                path: ["id"]
            });
        }
    })),
});
/**
 * Schéma de validation pour le patch
 */
exports.patchResponseSchema = zod_1.z.object({
    id: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "response");
        if (!existing) {
            ctx.addIssue({
                code: "custom",
                message: "Response does not exist",
                path: ["id"]
            });
        }
    })),
});
