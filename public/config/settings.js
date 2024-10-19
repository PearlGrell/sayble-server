"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
// Third-party imports
const path_1 = __importDefault(require("path"));
// dbpath : /Users/lazycodebaker/Documents/web/etoffe/server/src/database/database.sqlite3
// this file is in   /Users/lazycodebaker/Documents/web/etoffe/server/src/config/settings.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.settings = {
    // General application settings
    APPNAME: 'Sayble',
    // password: "123",
    // Server settings
    server: {
        port: 8000,
        apiPrefix: '/api',
    },
    cors: {
        origin: '*',
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    // Database settings
    database: {
        path: path_1.default.join(__dirname, '../database/database.sqlite3'),
        migrationsPath: path_1.default.join(__dirname, '../database/migrations'),
    },
    auth: {
        JWT_SECRET: process.env.JWT_SECRET,
    },
    mail: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: Number(process.env.SMTP_PORT),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
    }
};
