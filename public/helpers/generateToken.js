"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
const generateToken = (user_id) => {
    const token = jsonwebtoken_1.default.sign({ user_id }, settings_1.settings.auth.JWT_SECRET, { algorithm: "HS256" });
    return token;
};
exports.default = generateToken;
