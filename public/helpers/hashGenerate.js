"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashGenerate = void 0;
// Third-party imports
const crypto_1 = __importDefault(require("crypto"));
const hashGenerate = (text) => {
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.pbkdf2Sync(text, salt, 1000, 64, 'sha512').toString('hex');
    //       logger.info(`🚀 Hash generated for ${text}`)
    return { salt, hash };
};
exports.hashGenerate = hashGenerate;
