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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherChat = exports.pusher = void 0;
const pusher_1 = __importDefault(require("pusher"));
exports.pusher = new pusher_1.default({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
});
const PusherChat = (chatId, message, senderId, receiverId, createdAt, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.pusher.trigger(`chat_${chatId}`, "new-message", { chatId: chatId, senderId: senderId, receiverId: receiverId, content: message, createdAt: createdAt, messageId: messageId });
    }
    catch (e) {
        console.log(e);
    }
});
exports.PusherChat = PusherChat;
