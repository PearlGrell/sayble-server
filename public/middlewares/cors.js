"use strict";
// Author : Anshuman Tiwari ( lazycodebaker )
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCors = void 0;
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("../config/settings");
// Define CORS options
const corsOptions = settings_1.settings.cors;
// Optionally, a middleware function for handling pre-flight requests
const handleOptions = (request, response, next) => {
    if (request.method === 'OPTIONS') {
        response.sendStatus(200);
    }
    else {
        next();
    }
    ;
};
// Create a middleware function for applying CORS
const applyCors = (app) => {
    app.use((0, cors_1.default)(corsOptions));
    app.use(handleOptions);
};
exports.applyCors = applyCors;
