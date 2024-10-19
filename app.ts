// Author : Anshuman Tiwari ( lazycodebaker )

// Third-party imports
import express, { Express } from 'express';
import bodyParser from 'body-parser';

import path from 'path';

// Custom imports
import { applyCors } from './middlewares/cors';

// Create an express application
const app: Express = express();

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/.well-known',express.static(path.join(__dirname,".well-known")));

// Configure CORS
applyCors(app);

// Configure express application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
