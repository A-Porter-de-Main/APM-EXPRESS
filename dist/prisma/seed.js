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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const disconnectPrismaClient_1 = require("../utils/disconnectPrismaClient");
const skills_1 = require("../data/skills");
const requestStatus_1 = require("../data/requestStatus");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function main(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SeedRoles();
        yield SeedSkills();
        yield SeedRequesStatus();
        yield SeedAdmin();
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
        let findExisting = yield prisma.role.findUnique({ where: { name: role.name } });
        if (findExisting)
            return;
        const createdRole = yield prisma.role.create({ data: role });
    }));
    console.log("Role Seeding Success");
});
const SeedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting Seed Admin");
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        throw new Error('ADMIN_EMAIL environment variable is not defined.');
    }
    const findAdmin = yield prisma.user.findUnique({
        where: {
            email: adminEmail
        },
    });
    if (findAdmin)
        return;
    const getAdminRole = yield prisma.role.findUnique({ where: { name: "admin" } });
    if (!getAdminRole)
        return;
    const encryptPassword = yield bcrypt_1.default.hash(process.env.ADMIN_PASSWORD, 10);
    const createdAdmin = yield prisma.user.create({
        data: {
            email: process.env.ADMIN_EMAIL,
            password: encryptPassword,
            roleId: getAdminRole.id,
            firstName: "Admin",
            lastName: "Admin",
            addresses: {
                create: {
                    latitude: 0,
                    longitude: 0,
                    street: "Admin",
                    zipCode: "00000",
                    city: "Admin",
                },
            },
            phone: "0000000000",
            picturePath: "uploads/placeholder.jpg",
        }
    });
    console.log("Admin Seeding Success");
});
const SeedRequesStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting Seed RequestStatus");
    requestStatus_1.requestStatus.map((status) => __awaiter(void 0, void 0, void 0, function* () {
        let findExisting = yield prisma.requestStatus.findUnique({ where: { code: status.code } });
        if (findExisting)
            return;
        const createdRole = yield prisma.requestStatus.create({ data: status });
    }));
    console.log("RequestStatus Seeding Success");
});
const SeedSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting Seed Skills");
    const copySkills = [...skills_1.skills];
    for (const item of copySkills) {
        let findExisting = yield prisma.skill.findUnique({ where: { name: item.name } });
        if (findExisting)
            return;
        const oldId = item.id;
        const created = yield prisma.skill.create({
            data: {
                name: item.name,
                description: item.description,
                parentId: item.parentId ? item.parentId : null
            }
        });
        copySkills.map((oneSkill) => {
            if (oneSkill.parentId === oldId)
                oneSkill.parentId = created.id;
        });
    }
    console.log("Skill Seeding Success");
});
main(() => (0, disconnectPrismaClient_1.disconnectPrisma)(prisma));
