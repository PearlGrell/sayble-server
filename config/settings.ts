
// Third-party imports
import path from 'path';

// Custom imports

import { Settings } from '../types'

// dbpath : /Users/lazycodebaker/Documents/web/etoffe/server/src/database/database.sqlite3
// this file is in   /Users/lazycodebaker/Documents/web/etoffe/server/src/config/settings.ts

import dotenv from 'dotenv';
dotenv.config();

export const settings: Settings = {
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
            path: path.join(__dirname, '../database/database.sqlite3'),
            migrationsPath: path.join(__dirname, '../database/migrations'),
      },

      auth: {
            JWT_SECRET: process.env.JWT_SECRET!,
      },
      mail:{
            SMTP_HOST: process.env.SMTP_HOST!,
            SMTP_PORT: Number(process.env.SMTP_PORT!),
            SMTP_USER: process.env.SMTP_USER!,
            SMTP_PASS: process.env.SMTP_PASS!,
      }
};
