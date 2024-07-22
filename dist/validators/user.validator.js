"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidator = exports.userValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userValidator = [
    (0, express_validator_1.check)('username').notEmpty().withMessage('Username cannot be empty'),
    (0, express_validator_1.check)('email').notEmpty().isEmail().withMessage('Invalid email format'),
    // Ajoutez d'autres validations pour les champs de l'utilisateur
];
exports.userUpdateValidator = [
    (0, express_validator_1.check)('username').notEmpty().withMessage('Username cannot be empty'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email format'),
    // Ajoutez d'autres validations pour les champs de l'utilisateur
];
