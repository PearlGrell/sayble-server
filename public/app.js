"use strict";
// Author : Anshuman Tiwari ( lazycodebaker )
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Third-party imports
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
// Custom imports
const cors_1 = require("./middlewares/cors");
// Create an express application
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '500mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '500mb', extended: true }));
// Serve static files from the uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/.well-known', express_1.default.static(path_1.default.join(__dirname, ".well-known")));
// Configure CORS
(0, cors_1.applyCors)(app);
// Configure express application
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
exports.default = app;
