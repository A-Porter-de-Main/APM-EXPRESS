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
exports.createMessageSchema = void 0;
const zod_1 = require("zod");
const checkFields_1 = require("../utils/checkFields");
exports.createMessageSchema = zod_1.z.object({
    chatId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingChat = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "chat");
        if (!existingChat) {
            ctx.addIssue({
                code: "custom",
                message: "Chat does not exist",
                path: ["chatId"]
            });
        }
    })),
    content: zod_1.z.string().min(1),
    senderId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "user");
        if (!existingUser) {
            ctx.addIssue({
                code: "custom",
                message: "User does not exist",
                path: ["senderId"]
            });
        }
    })),
    receiverId: zod_1.z.string().min(1).superRefine((val, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, checkFields_1.CheckExistingFieldForZod)("id", val, "user");
        if (!existingUser) {
            ctx.addIssue({
                code: "custom",
                message: "User does not exist",
                path: ["receiverID"]
            });
        }
    })),
});
