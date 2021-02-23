import "module-alias/register";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './routes';
import errorMiddleware from '@middlewares/error.middleware';
import sequelize from '@root/database/connection'
import path from 'path';
import { User } from "@models/user.model";
import corsMiddleware from '@middlewares/cors.middleware';

// Declaring custom value types.
declare global {
    namespace NodeJS {
      interface Global {
         appRoot: string;
      } 
    }

    namespace Express {
        interface Request {
            file: Express.Multer.File
        }
    }

    namespace Express {
        interface Request {
            auth: { user?: User }
        }
    }
  }

global.appRoot = path.resolve(__dirname);

const app = express();

app.use(express.json());

app.use(corsMiddleware);

app.use(router);

app.use(errorMiddleware);

    
sequelize.authenticate()
.then(() => { 
    console.log('Database connected.'); 

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening at ${PORT}`);
    });

})
.catch(() => { console.log('Failed to connect to database.'); })


export default app;