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
exports.CreateUser = exports.AuthenticateUser = exports.GenerateToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const customErrors_1 = require("../../utils/customErrors");
const checkFields_1 = require("../../utils/checkFields");
const findRole_1 = require("../../utils/findRole");
const prisma = new client_1.PrismaClient();
/**
 * Fonction de génération de Token JWT
 * @param user
 * @returns Un JWT signé avec les informations utilisateurs
 */
const GenerateToken = (user) => {
    if (process.env.JWT_SECRET) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, firstName: user.firstName, role: user.role.name }, // Payload
        process.env.JWT_SECRET, // Clé secrète
        { expiresIn: process.env.JWT_EXPIRES_IN } // Options de token
        );
    }
};
exports.GenerateToken = GenerateToken;
/**
 * Fonction de login
 * @param credentials
 * @returns
 */
const AuthenticateUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = credentials;
        const user = yield prisma.user.findUnique({
            where: { email },
            include: {
                role: true
            }
        });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            (0, customErrors_1.badCredentialsError)("Email or Password invalid");
        }
        const token = (0, exports.GenerateToken)(user);
        return { token, user };
    }
    catch (e) {
        throw e;
    }
});
exports.AuthenticateUser = AuthenticateUser;
/**
 * Fonction de création d'utilisateur avec son Addresse
 * @param userData
 * @returns
 */
const CreateUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, description, email, phone, password, stripeUserId, picturePath, longitude, latitude, street, zipCode } = userData;
        //Vérifie si Phone et Email existe 
        const isPhoneAlreadyExist = yield (0, checkFields_1.CheckExistingField)("phone", phone);
        const isEmailAlreadyExist = yield (0, checkFields_1.CheckExistingField)("email", email);
        //Récupère le rôle user en bdd
        let findingRole = yield (0, findRole_1.FindRoleId)("user");
        if (!findingRole)
            (0, customErrors_1.notFoundError)("Role");
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const address = {
            latitude: typeof latitude != "number" ? parseFloat(latitude) : latitude,
            longitude: typeof longitude != "number" ? parseFloat(longitude) : latitude,
            street: street,
            zipCode: zipCode
        };
        const user = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                description,
                email,
                phone,
                password: hashedPassword,
                stripeUserId,
                picturePath: picturePath,
                createdAt: new Date(),
                updatedAt: new Date(),
                roleId: findingRole === null || findingRole === void 0 ? void 0 : findingRole.id,
                addresses: {
                    create: address
                }
            },
            include: {
                role: true,
                addresses: true,
            }
        });
        const token = (0, exports.GenerateToken)(user);
        return { token, user };
    }
    catch (e) {
        throw e;
    }
});
exports.CreateUser = CreateUser;
