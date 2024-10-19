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
exports.UserRoutes = void 0;
const User_1 = require("../controller/User");
const app_1 = __importDefault(require("../app"));
const settings_1 = require("../config/settings");
const apiPrefix = settings_1.settings.server.apiPrefix;
const UserRoutes = (options) => __awaiter(void 0, void 0, void 0, function* () {
    yield app_1.default.post(`${apiPrefix}/auth/create`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.createUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.get(`${apiPrefix}/user/current`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.getUserFromToken)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.get(`${apiPrefix}/users`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.getUsers)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.get(`${apiPrefix}/users/:id`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.getUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.post(`${apiPrefix}/auth/verify`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.verifyUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.put(`${apiPrefix}/users/credentials`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.updateUsernameAndPassword)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.post(`${apiPrefix}/auth/login`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.loginUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.post(`${apiPrefix}/auth/logout`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.logoutUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.get(`${apiPrefix}/users/:id`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.getUser)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    yield app_1.default.post(`${apiPrefix}/auth/resendotp`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.resendOTP)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    app_1.default.post(`${apiPrefix}/auth/forgotpassword`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.forgotPassword)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    app_1.default.post(`${apiPrefix}/auth/resetpassword`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.resetPassword)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
    app_1.default.post(`${apiPrefix}/user/profile/image`, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, User_1.updateProfileImage)({
            request: request,
            response: response,
            em: options.orm.em.fork()
        });
    }));
});
exports.UserRoutes = UserRoutes;
