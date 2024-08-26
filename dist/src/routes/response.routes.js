"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const validatorMiddlewares_1 = require("../../middlewares/validatorMiddlewares");
const response_controller_1 = require("../controllers/response.controller");
const resp_validator_1 = require("../../validators/resp.validator");
const responseRouter = (0, express_1.Router)();
responseRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), response_controller_1.GetResponses);
responseRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), response_controller_1.GetOneById);
responseRouter.post('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), (0, validatorMiddlewares_1.validateDataAsync)(resp_validator_1.createResponseSchema), response_controller_1.PostResponse);
responseRouter.patch('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), (0, validatorMiddlewares_1.validateParamsAsync)(resp_validator_1.patchResponseSchema), response_controller_1.PatchResponse);
responseRouter.delete('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), (0, validatorMiddlewares_1.validateParamsAsync)(resp_validator_1.deleteResponseSchema), response_controller_1.DeleteById);
exports.default = responseRouter;
