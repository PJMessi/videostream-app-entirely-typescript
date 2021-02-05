import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './routes';
import errorMiddleware from './middlewares/error.middleware';
import sequelize from './database/connection'

const app = express();

app.use(router);

app.use(errorMiddleware);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    
    sequelize.authenticate()
    .then(() => { console.log('Database connected.'); })
    .catch(() => { console.log('Failed to connect to database.'); })
});