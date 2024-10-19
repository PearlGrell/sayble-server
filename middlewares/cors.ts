// Author : Anshuman Tiwari ( lazycodebaker )


import cors, { CorsOptions } from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { settings } from '../config/settings';

// Define CORS options
const corsOptions: CorsOptions = settings.cors;

// Optionally, a middleware function for handling pre-flight requests
const handleOptions = (request: Request, response: Response, next: NextFunction): void => {
  if (request.method === 'OPTIONS') {
    response.sendStatus(200);
  } else {
    next();
  };
};

// Create a middleware function for applying CORS
export const applyCors = (app: express.Application): void => {
  app.use(cors(corsOptions));
  app.use(handleOptions)
};

