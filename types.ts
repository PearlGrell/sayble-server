
import { Request, Response } from 'express';
import { CorsOptions } from 'cors';
import { EntityManager, SqlEntityManager, SqliteDriver } from '@mikro-orm/sqlite';
import { SqliteMikroORM } from '@mikro-orm/sqlite/SqliteMikroORM';

export interface TContext {
      request: Request
      response: Response,
      em: SqlEntityManager<SqliteDriver> & EntityManager<any>
}

export type Settings = {
      APPNAME: string;
     // password: string;
      server: {
            port: number;
            apiPrefix: string;
      };
      cors: CorsOptions,
      database: {
            path: string;
            migrationsPath: string;
      };
      auth: {
            JWT_SECRET: string;
      };
      mail: {
            SMTP_HOST: string;
            SMTP_PORT: number;
            SMTP_USER: string;
            SMTP_PASS: string;
      };
};

export type User = {
      id: string;
      firstName: string; 
      lastName: string;
      username : string;
      email: string;
      password: string;
      image : string;
      dob : Date;
      otp : string;
      isVerified : boolean;
      isLoggedIn : boolean;
      salt : string;
      createdAt: Date;
      updatedAt: Date;
};

export type APIContextType = {
      request: Request
      response: Response
      em: SqlEntityManager<SqliteDriver> & EntityManager<any>
};

export type Options = {
      orm : SqliteMikroORM,
      testConnection: () => Promise<void>;
      syncModels: () => Promise<void>;
      createTables: () => Promise<void>;
}