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
exports.test = exports.Register = exports.Login = void 0;
const client_1 = require("@prisma/client");
const auth_services_1 = require("../services/auth.services");
const prisma = new client_1.PrismaClient();
/**
 * [POST] Fonction de connexion
 * @param req
 * @param res
 * @returns Json
 */
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loggedUser = yield (0, auth_services_1.AuthenticateUser)({ email, password });
        res.json(loggedUser);
    }
    catch (e) {
        next(e);
    }
});
exports.Login = Login;
/**
 * [POST] Inscription utilisateur
 * @param req
 * @param res
 * @param next
 */
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, description, email, phone, password, stripeUserId, longitude, latitude, street, zipCode } = req.body;
        //Si pas d'image alors on met l'image placeholder
        const picturePath = req.file ? req.file.path : "/uploads/placeholder.jpg";
        const createdUser = yield (0, auth_services_1.CreateUser)({ firstName, lastName, description, email, phone, password, stripeUserId, longitude, latitude, street, zipCode, picturePath });
        return res.status(201).json(createdUser);
    }
    catch (e) {
        next(e);
    }
});
exports.Register = Register;
const test = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'tqt fraté' });
    }
    catch (e) {
        next(e);
    }
});
exports.test = test;
