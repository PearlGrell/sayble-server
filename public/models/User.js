"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UserModel = void 0;
const core_1 = require("@mikro-orm/core");
const hashGenerate_1 = require("../helpers/hashGenerate");
const otpGenerate_1 = __importDefault(require("../helpers/otpGenerate"));
const generateToken_1 = __importDefault(require("../helpers/generateToken"));
const mailSent_1 = require("../services/mailSent");
const uuid_1 = require("uuid");
const verifyPassword_1 = require("../helpers/verifyPassword");
let UserModel = class UserModel {
    constructor(user) {
        this.isVerified = false;
        this.isLoggedIn = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.id = (0, uuid_1.v4)();
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.dob = user.dob;
        this.image = user.image;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.username = user.username;
        this.setPassword(user.password);
    }
    ;
    setOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            const { hash, salt } = yield (0, hashGenerate_1.hashGenerate)(this.firstName + this.lastName);
            const otpGenerated = yield (0, otpGenerate_1.default)();
            this.otp = otpGenerated;
            this.salt = salt;
            this.password = hash;
        });
    }
    ;
    resendOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            const otpGenerated = yield (0, otpGenerate_1.default)();
            this.otp = otpGenerated;
        });
    }
    ;
    setPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.temp_password = password;
            const { hash, salt } = yield (0, hashGenerate_1.hashGenerate)(password);
            this.password = hash;
            this.salt = salt;
            // send the otp now 
            const otpGenerated = yield (0, otpGenerate_1.default)();
            this.otp = otpGenerated;
        });
    }
    ;
    setUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            this.username = username;
        });
    }
    ;
    isUserVerified() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isVerified;
        });
    }
    ;
    isUserLoggedin() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isLoggedIn;
        });
    }
    ;
    loginUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoggedIn = true;
            return this;
        });
    }
    ;
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoggedIn = false;
            return this;
        });
    }
    ;
    verifyUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isVerified = true;
            return this;
        });
    }
    ;
    saveUser(em) {
        return __awaiter(this, void 0, void 0, function* () {
            yield yield em.persistAndFlush(this);
        });
    }
    ;
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield (0, generateToken_1.default)(this.id);
            return token;
        });
    }
    ;
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordVerified = yield (0, verifyPassword_1.verifyPassword)({
                password: password,
                user: this
            });
            return passwordVerified;
        });
    }
    ;
    sendMail(mailType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mailSent_1.sendMail)({
                mailType: mailType,
                otp: this.otp,
                to: this.email,
                firstname: this.firstName,
                password: this.temp_password,
                username: this.username
            });
        });
    }
    ;
};
exports.UserModel = UserModel;
__decorate([
    (0, core_1.PrimaryKey)({
        name: "id",
        type: "string"
    })
], UserModel.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({
        name: "firstName",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)({
        name: "lastName",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)({
        name: "username",
        type: "varchar",
        length: 255,
        nullable: true
    })
], UserModel.prototype, "username", void 0);
__decorate([
    (0, core_1.Property)({
        name: "email",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({
        name: "password",
        type: "varchar",
        length: 255,
        nullable: true
    })
], UserModel.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)({
        name: "dob",
        type: "date",
        default: Date.now(),
        onUpdate: () => new Date(),
    })
], UserModel.prototype, "dob", void 0);
__decorate([
    (0, core_1.Property)({
        name: "image",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "image", void 0);
__decorate([
    (0, core_1.Property)({
        name: "isVerified",
        type: "boolean",
    })
], UserModel.prototype, "isVerified", void 0);
__decorate([
    (0, core_1.Property)({
        name: "isLoggedIn",
        type: "boolean",
    })
], UserModel.prototype, "isLoggedIn", void 0);
__decorate([
    (0, core_1.Property)({
        name: "otp",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "otp", void 0);
__decorate([
    (0, core_1.Property)({
        name: "salt",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "salt", void 0);
__decorate([
    (0, core_1.Property)({
        name: "temp_password",
        type: "varchar",
        length: 255,
    })
], UserModel.prototype, "temp_password", void 0);
__decorate([
    (0, core_1.Property)({
        name: "createdAt",
        type: "date",
        default: Date.now(),
        onUpdate: () => new Date(),
    })
], UserModel.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({
        name: "updatedAt",
        type: "date",
        default: Date.now(),
        onUpdate: () => new Date(),
    })
], UserModel.prototype, "updatedAt", void 0);
exports.UserModel = UserModel = __decorate([
    (0, core_1.Entity)({ tableName: "User" })
], UserModel);
;
