"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateValidator = exports.productValidator = void 0;
const express_validator_1 = require("express-validator");
exports.productValidator = [
    (0, express_validator_1.check)('name').notEmpty().isString().withMessage('Name cannot be empty'),
    (0, express_validator_1.check)('description').notEmpty().isString().withMessage('Description cannot be empty'),
    (0, express_validator_1.check)("price").notEmpty().isInt().withMessage("Price must be an Int"),
    (0, express_validator_1.check)("reference").notEmpty().isString().withMessage("Reference cannot be empty")
];
exports.productUpdateValidator = [
    (0, express_validator_1.check)('name').isString().withMessage('Name must be a String'),
    (0, express_validator_1.check)('description').isString().withMessage('Description must be a string'),
    (0, express_validator_1.check)("price").isInt().withMessage("Price must be an Int"),
    (0, express_validator_1.check)("reference").isString().withMessage("Reference must be a string")
];
