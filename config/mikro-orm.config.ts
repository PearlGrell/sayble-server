
// Third-party imports
import { MikroORM, SqliteDriver } from "@mikro-orm/sqlite";

// Custom imports
import { models } from "../models";
import { settings } from "./settings";

// Path to the SQLite database file
const dbPath = settings.database.path

// Initialize MikroORM
export default {
      migrations: {
            path: settings.database.migrationsPath,
            pattern: /^[\w-]+\d+\.[tj]s$/,
      },
      entities: [...models],
      dbName: dbPath,
      type: 'sqlite',
      debug: true,
} as Parameters<typeof MikroORM.init<SqliteDriver>>[0];