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
exports.DeleteById = exports.PatchRequest = exports.PostRequest = exports.GetOneById = exports.GetRequests = void 0;
const client_1 = require("@prisma/client");
const request_services_1 = require("../services/request.services");
const prisma = new client_1.PrismaClient();
//Get
const GetRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield (0, request_services_1.GetAllRequest)();
        return res.status(200).json(requests);
    }
    catch (e) {
        next(e);
    }
});
exports.GetRequests = GetRequests;
//Get One :id
const GetOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const request = yield (0, request_services_1.GetOneRequestById)(id);
        return res.status(200).json(request);
    }
    catch (e) {
        next(e);
    }
});
exports.GetOneById = GetOneById;
//Post
const PostRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, deadline, skills, userId } = req.body;
        const request = yield (0, request_services_1.GetOneRequestById)(userId);
        return res.status(200).json(request);
    }
    catch (e) {
        next(e);
    }
});
exports.PostRequest = PostRequest;
//Update
const PatchRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (e) {
        next(e);
    }
});
exports.PatchRequest = PatchRequest;
//Delete
//Todo vérifier que Les skills et le user associé ne soit pas delete en cascade avec
const DeleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedRequest = yield (0, request_services_1.DeleteRequest)(id);
        return res.status(204);
    }
    catch (e) {
        next(e);
    }
});
exports.DeleteById = DeleteById;
