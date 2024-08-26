"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const skill_controller_1 = require("../controllers/skill.controller");
const skillRouter = (0, express_1.Router)();
skillRouter.get('/', (0, authMiddlewares_1.authHandler)(["admin", "user"]), skill_controller_1.GetSkills);
skillRouter.get('/:id', (0, authMiddlewares_1.authHandler)(["admin", "user"]), skill_controller_1.GetOneById);
exports.default = skillRouter;
