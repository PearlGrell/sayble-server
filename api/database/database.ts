import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const db = drizzle({ connection: {
  url: process.env.URL!,
  authToken: process.env.AUTH_TOKEN!,
}, schema});
