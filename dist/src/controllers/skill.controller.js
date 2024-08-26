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
exports.GetOneById = exports.GetSkills = void 0;
const skill_services_1 = require("../services/skill.services");
//Get
const GetSkills = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield (0, skill_services_1.GetAllSkills)();
        return res.status(200).json(skills);
    }
    catch (e) {
        next(e);
    }
});
exports.GetSkills = GetSkills;
//Get One :id
const GetOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const skill = yield (0, skill_services_1.GetOneSkilltById)(id);
        return res.status(200).json(skill);
    }
    catch (e) {
        next(e);
    }
});
exports.GetOneById = GetOneById;
