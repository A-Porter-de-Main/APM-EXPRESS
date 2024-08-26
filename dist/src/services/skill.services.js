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
exports.GetOneSkilltById = exports.GetAllSkills = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Récup tous les skills
 * @returns
 */
const GetAllSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield prisma.skill.findMany();
    if (!skills || skills.length <= 0) {
        (0, customErrors_1.NoContent)();
    }
    return skills;
});
exports.GetAllSkills = GetAllSkills;
/**
 * Récupère le skill par son id
 * @param skillId
 * @returns
 */
const GetOneSkilltById = (skillId) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield prisma.skill.findUnique({
        where: { id: skillId },
    });
    if (!skill) {
        (0, customErrors_1.notFoundError)("Skill not found");
    }
    return skill;
});
exports.GetOneSkilltById = GetOneSkilltById;

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
exports.GetOneSkilltById = exports.GetAllSkills = void 0;
const client_1 = require("@prisma/client");
const customErrors_1 = require("../../utils/customErrors");
const prisma = new client_1.PrismaClient();
/**
 * Récup tous les skills
 * @returns
 */
const GetAllSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield prisma.skill.findMany();
    if (!skills || skills.length === 0) {
        (0, customErrors_1.NoContent)();
    }
    return skills;
});
exports.GetAllSkills = GetAllSkills;
/**
 * Récupère le skill par son id
 * @param skillId
 * @returns
 */
const GetOneSkilltById = (skillId) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield prisma.skill.findUnique({
        where: { id: skillId },
    });
    if (!skill) {
        return (0, customErrors_1.notFoundError)("Skill not found");
    }
    return skill;
});
exports.GetOneSkilltById = GetOneSkilltById;
