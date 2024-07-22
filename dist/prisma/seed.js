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
const client_1 = require("@prisma/client");
const disconnectPrismaClient_1 = require("../utils/disconnectPrismaClient");
const prisma = new client_1.PrismaClient();
function main(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SeedRoles();
        callback();
    });
}
const SeedRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting Seed Role");
    const roles = [
        { name: "user" },
        { name: "admin" },
    ];
    roles.map((role) => __awaiter(void 0, void 0, void 0, function* () {
        const createdRole = yield prisma.role.create({ data: role });
    }));
    console.log("Role Seeding Success");
});
main(() => (0, disconnectPrismaClient_1.disconnectPrisma)(prisma));
