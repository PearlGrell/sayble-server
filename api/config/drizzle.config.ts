import { Config } from "drizzle-kit";

export default {
    dialect: 'turso',
    out: './api/database/migrations',
    schema : './api/database/schema.ts',
    dbCredentials : {
        url : process.env.URL!,
        authToken : process.env.AUTH_TOKEN!
    }
} satisfies Config;