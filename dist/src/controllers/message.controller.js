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
exports.PostMessage = exports.GetOneById = exports.GetMessages = void 0;
const skill_services_1 = require("../services/skill.services");
const message_services_1 = require("../services/message.services");
//Get
const GetMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield (0, message_services_1.GetAllMessages)();
        return res.status(200).json(messages);
    }
    catch (e) {
        next(e);
    }
});
exports.GetMessages = GetMessages;
//Get One :id
const GetOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield (0, skill_services_1.GetOneSkilltById)(id);
        return res.status(200).json(message);
    }
    catch (e) {
        next(e);
    }
});
exports.GetOneById = GetOneById;
//Create
const PostMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, content, senderId, receiverId } = req.body;
        const createdMesage = yield (0, message_services_1.CreateMessage)({ chatId, content, senderId, receiverId });
        res.status(201).json(createdMesage);
    }
    catch (e) {
        next(e);
    }
});
exports.PostMessage = PostMessage;
