"use strict";
// Author : Anshuman Tiwari ( lazycodebaker )
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
// Third-party imports
// Custom imports
const app_1 = __importDefault(require("./app"));
const settings_1 = require("./config/settings");
const connector_1 = __importDefault(require("./database/connector"));
const routes_1 = require("./routes");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // microOrmDatabase() // Start the database
        yield (0, connector_1.default)().then((options) => __awaiter(void 0, void 0, void 0, function* () {
            options.syncModels();
            options.testConnection();
            // options.createTables()
            // options.orm.migrator.createMigration()
            yield (0, routes_1.Routes)(options);
        }));
        app_1.default.listen(settings_1.settings.server.port, () => {
            console.log(`Server started on port ${settings_1.settings.server.port}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Exit the process if there's an error starting the server
    }
    ;
});
exports.default = startServer;
