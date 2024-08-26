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
const request_services_1 = require("../services/request.services");
//Todo => ajouter les nouveaux champ dans les crud et update
//Status => créer un seeding "ouvert", "fermer","en cours" et par defaut mettre le status sur ouvert
//  => faire la création d'une response sur la requête, donc quand je mdoifie une requete je veux pouvoir virer les responses
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
        const { description, deadline, skills, userId, } = req.body;
        const photos = req.files ? req.files : undefined;
        console.log("les fichiers: ", photos);
        //Le formdata transforme mon tableau en string
        //Ducoup je le retransforme en tableau
        // const stringToArraySkill = JSON.parse(skills);
        // console.log("skills before: ", typeof skills)
        // console.log("skills after: ", typeof stringToArraySkill)
        const requestCreated = yield (0, request_services_1.CreateRequest)({ description, deadline, skills: skills, userId, photos: photos });
        return res.status(201).json(requestCreated);
    }
    catch (e) {
        next(e);
    }
});
exports.PostRequest = PostRequest;
//Update
const PatchRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, deadline, skills, userId, } = req.body;
        const photos = req.files ? req.files : undefined;
        const { id } = req.params;
        console.log("les fichiers: ", photos);
        console.log("les skills: ", skills);
        const stringToArraySkill = skills ? JSON.parse(skills) : undefined;
        const requestUpdated = yield (0, request_services_1.UpdateRequest)(id, { description, deadline, skills: stringToArraySkill, userId, photos: photos });
        return res.status(200).json(requestUpdated);
    }
    catch (e) {
        next(e);
    }
});
exports.PatchRequest = PatchRequest;
//Delete
const DeleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("ici 2");
        const deletedRequest = yield (0, request_services_1.DeleteRequest)(id);
        return res.status(204).json("");
    }
    catch (e) {
        next(e);
    }
});
exports.DeleteById = DeleteById;
