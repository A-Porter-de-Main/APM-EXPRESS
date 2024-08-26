"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../../validators/auth.validator");
const multer_1 = __importDefault(require("../../config/multer"));
const validatorMiddlewares_1 = require("../../middlewares/validatorMiddlewares");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, validatorMiddlewares_1.validateData)(auth_validator_1.userLoginSchema), auth_controller_1.Login);
authRouter.post('/register', multer_1.default.single("photo"), (0, validatorMiddlewares_1.validateData)(auth_validator_1.userRegistrationSchema), auth_controller_1.Register);
authRouter.get("/users", (0, authMiddlewares_1.authHandler)(["user", "admin"]), auth_controller_1.GetAll);
authRouter.get("/test", auth_controller_1.Test);
exports.default = authRouter;
