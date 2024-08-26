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
exports.DeleteById = exports.PatchResponse = exports.PostResponse = exports.GetOneById = exports.GetResponses = void 0;
const response_services_1 = require("../services/response.services");
//Get
const GetResponses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responses = yield (0, response_services_1.GetAllResponse)();
        return res.status(200).json(responses);
    }
    catch (e) {
        next(e);
    }
});
exports.GetResponses = GetResponses;
//Get One :id
const GetOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const response = yield (0, response_services_1.GetOneResponseById)(id);
        return res.status(200).json(response);
    }
    catch (e) {
        next(e);
    }
});
exports.GetOneById = GetOneById;
//Post
const PostResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, requestId } = req.body;
        const photos = req.files ? req.files : undefined;
        const responseCreated = yield (0, response_services_1.CreateResponse)({ userId, requestId });
        return res.status(201).json(responseCreated);
    }
    catch (e) {
        next(e);
    }
});
exports.PostResponse = PostResponse;
//Update
const PatchResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, requestId } = req.body;
        const { id } = req.params;
        const responseUpdated = yield (0, response_services_1.UpdateResponse)(id, { userId, requestId });
        return res.status(200).json(responseUpdated);
    }
    catch (e) {
        next(e);
    }
});
exports.PatchResponse = PatchResponse;
//Delete
const DeleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("ici 2");
        const deletedResponse = yield (0, response_services_1.DeleteResponse)(id);
        return res.status(200).json({ message: "Response deleted" });
    }
    catch (e) {
        next(e);
    }
});
exports.DeleteById = DeleteById;
