"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUpdateValidator = exports.orderValidator = void 0;
const express_validator_1 = require("express-validator");
exports.orderValidator = [
    (0, express_validator_1.check)('userId').isInt().withMessage('Invalid userId'),
    (0, express_validator_1.check)('productIds').isArray().withMessage('Invalid productIds'),
    (0, express_validator_1.check)("")
    // Ajoutez d'autres validations pour les champs de la commande
];
exports.orderUpdateValidator = [
    (0, express_validator_1.check)('userId').isInt().withMessage('Invalid userId'),
    (0, express_validator_1.check)('productIds').isArray().withMessage('Invalid productIds'),
    (0, express_validator_1.check)("")
];
