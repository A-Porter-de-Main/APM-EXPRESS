"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const chat_controller_1 = require("../controllers/chat.controller");
const chatRouter = (0, express_1.Router)();
chatRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), chat_controller_1.GetChats);
chatRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), chat_controller_1.GetOneById);
chatRouter.get('/my/:userId', (0, authMiddlewares_1.authHandler)(["admin", "user"]), chat_controller_1.GetChatByUserId);
exports.default = chatRouter;
