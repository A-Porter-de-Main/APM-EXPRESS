"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = exports.fileStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const uploadsDir = "uploads";
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadsDir);
        // callback(null, path);
    },
    filename: (req, file, callback) => {
        const uuid = (0, uuid_1.v4)();
        const ext = path_1.default.extname(file.originalname);
        const newFileName = uuid + ext;
        callback(null, newFileName);
    },
});
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.fileFilter = fileFilter;
const upload = (0, multer_1.default)({
    storage: exports.fileStorage,
    fileFilter: exports.fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
});
exports.default = upload;
