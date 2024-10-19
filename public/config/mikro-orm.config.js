"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom imports
const models_1 = require("../models");
const settings_1 = require("./settings");
// Path to the SQLite database file
const dbPath = settings_1.settings.database.path;
// Initialize MikroORM
exports.default = {
    migrations: {
        path: settings_1.settings.database.migrationsPath,
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [...models_1.models],
    dbName: dbPath,
    type: 'sqlite',
    debug: true,
};
