"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const multer_1 = __importDefault(require("../../config/multer"));
const validatorMiddlewares_1 = require("../../middlewares/validatorMiddlewares");
const request_controller_1 = require("../controllers/request.controller");
const request_validator_1 = require("../../validators/request.validator");
const requestRouter = (0, express_1.Router)();
requestRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_controller_1.GetRequests);
requestRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_controller_1.GetOneById);
requestRouter.post('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), multer_1.default.array("photos"), (0, validatorMiddlewares_1.validateDataAsync)(request_validator_1.createRequestSchema), request_controller_1.PostRequest);
requestRouter.patch('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), multer_1.default.array("photos"), (0, validatorMiddlewares_1.validateParamsAsync)(request_validator_1.patchRequestSchema), request_controller_1.PatchRequest);
requestRouter.delete('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), (0, validatorMiddlewares_1.validateParamsAsync)(request_validator_1.deleteRequestSchema), request_controller_1.DeleteById);
exports.default = requestRouter;
