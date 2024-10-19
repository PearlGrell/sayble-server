// Author : Anshuman Tiwari ( lazycodebaker )


// Third-party imports


// Custom imports
import app from './app';
import { settings } from './config/settings';
import createMicroOrmDatabase from './database/connector'; 
import { Routes } from './routes';
import { Options } from './types';

const startServer = async (): Promise<void> => {
      try {
            // microOrmDatabase() // Start the database
            await createMicroOrmDatabase().then(async (options: Options) => {
                  options.syncModels()
                  options.testConnection() 
                  // options.createTables()
                  // options.orm.migrator.createMigration()

                  await Routes(options);
            });

            app.listen(settings.server.port, () => {
                  console.log(`Server started on port ${settings.server.port}`)
            });
      }
      catch (error) {
            console.error('Error starting the server:', error)
            process.exit(1) // Exit the process if there's an error starting the server
      };
};

export default startServer;