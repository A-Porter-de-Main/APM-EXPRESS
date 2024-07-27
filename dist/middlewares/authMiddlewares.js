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
exports.authHandler = authHandler;
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function authHandler(roles) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        //Récup la requete avec le bearer
        let authBearer = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
        console.log("C'est toi le auth bearer ? : ", authBearer);
        if (!authBearer)
            return res.status(401).end();
        let token = (0, jsonwebtoken_1.decode)(authBearer);
        if (!token)
            return res.status(401).end();
        const existngUser = yield prisma.user.findUnique({ where: { id: token.id } });
        if (roles.includes(token.role) && existngUser) {
            next();
        }
        else {
            return res.status(401).end();
        }
    });
}
