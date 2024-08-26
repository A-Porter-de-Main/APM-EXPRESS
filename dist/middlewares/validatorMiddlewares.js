"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
exports.validateDataAsync = validateDataAsync;
exports.validateParamsAsync = validateParamsAsync;
const zod_1 = require("zod");
/**
 * Middleware de validation synchrone, lorsque l'on vérifie uniquement que le format des données sont bons et que les données essentiel sont renseigner
 * @param schema
 * @returns
 */
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                return res.status(400).json({ error: 'Invalid data', details: errorMessages });
            }
        }
    };
}
/**
 * Middleware de validation asynchrone, pour les vérification des données en base
 * @param schema
 * @returns
 */
function validateDataAsync(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body, "req.body validateDataAsync");
            yield schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(400).json({ error: 'Invalid data', details: errorMessages });
            }
        }
    });
}
/**
 * Middleware de validation des données en params
 * @param schema
 * @returns
 */
function validateParamsAsync(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield schema.parseAsync({ id });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(400).json({ error: 'Invalid data', details: errorMessages });
            }
        }
    });
}
