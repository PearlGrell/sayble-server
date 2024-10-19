"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerify = void 0;
// Third-party imports
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Custom imports
const settings_1 = require("../config/settings");
const tokenVerify = (token) => {
    if (token.length < 1)
        return '';
    let user_id = "";
    jsonwebtoken_1.default.verify(token, settings_1.settings.auth.JWT_SECRET, (err, decoded) => {
        if (err)
            console.log(err);
        user_id = decoded === null || decoded === void 0 ? void 0 : decoded.user_id;
    });
    //  logger.info(`Token verification for ${user_id}`)
    return user_id;
};
exports.tokenVerify = tokenVerify;
