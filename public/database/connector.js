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
// Third-party imports
const sqlite_1 = require("@mikro-orm/sqlite");
// Custom imports 
const mikro_orm_config_1 = __importDefault(require("../config/mikro-orm.config"));
const createMicroOrmDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // Setup MikroORM
    const orm = yield sqlite_1.MikroORM.init(mikro_orm_config_1.default);
    // Test the connection
    const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield orm.isConnected();
            console.log('Connection to the database has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
    // Sync the models with the database
    const syncModels = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield orm.getMigrator().up();
            console.log('Models synced with the database successfully.');
        }
        catch (error) {
            console.error('Unable to sync models with the database:', error);
        }
        ;
    });
    // This will create tables according to your model definitions
    const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield orm.getSchemaGenerator().createSchema();
            console.log('Tables created successfully.');
        }
        catch (error) {
            console.error('Unable to create tables:', error);
        }
        ;
    });
    return {
        orm,
        testConnection,
        syncModels,
        createTables
    };
});
;
exports.default = createMicroOrmDatabase;
