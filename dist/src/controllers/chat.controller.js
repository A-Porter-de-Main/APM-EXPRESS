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
exports.GetChatByUserId = exports.GetOneById = exports.GetChats = void 0;
const chat_services_1 = require("../services/chat.services");
//Get
const GetChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield (0, chat_services_1.GetAllChats)();
        return res.status(200).json(chats);
    }
    catch (e) {
        next(e);
    }
});
exports.GetChats = GetChats;
//Get One :id
const GetOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const chat = yield (0, chat_services_1.GetOneChatById)(id);
        return res.status(200).json(chat);
    }
    catch (e) {
        next(e);
    }
});
exports.GetOneById = GetOneById;
//Get chats by userId
const GetChatByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const chat = yield (0, chat_services_1.GetAllChatsByUserId)(userId);
        return res.status(200).json(chat);
    }
    catch (e) {
        next(e);
    }
}); //Get chats by userId
exports.GetChatByUserId = GetChatByUserId;
