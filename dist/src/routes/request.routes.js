"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../../validators/auth.validator");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const multer_1 = __importDefault(require("../../config/multer"));
const validatorMiddlewares_1 = require("../../middlewares/validatorMiddlewares");
const request_controller_1 = require("../controllers/request.controller");
const request_services_1 = require("../services/request.services");
const requestRouter = (0, express_1.Router)();
requestRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_controller_1.GetRequests);
requestRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_controller_1.GetOneById);
requestRouter.post('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_controller_1.PostRequest);
// requestRouter.patch('/', authHandler(["admin", "user"]), PatchRequest); //a faire
requestRouter.delete('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), request_services_1.DeleteRequest);
requestRouter.post('/register', multer_1.default.single("photo"), (0, validatorMiddlewares_1.validateData)(auth_validator_1.userRegistrationSchema), auth_controller_1.Register);
exports.default = requestRouter;
