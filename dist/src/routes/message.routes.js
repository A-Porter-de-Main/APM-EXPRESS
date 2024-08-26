"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const message_controller_1 = require("../controllers/message.controller");
const message_validator_1 = require("../../validators/message.validator");
const validatorMiddlewares_1 = require("../../middlewares/validatorMiddlewares");
const messageRouter = (0, express_1.Router)();
messageRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), message_controller_1.GetMessages);
messageRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), message_controller_1.GetOneById); //ajoute un validate param Url
messageRouter.post('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), (0, validatorMiddlewares_1.validateDataAsync)(message_validator_1.createMessageSchema), message_controller_1.PostMessage);
exports.default = messageRouter;
