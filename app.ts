import "module-alias/register";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from '#root/routes';
import errorMiddleware from '#root/middlewares/error.middleware';
import sequelize from '#root/database/connection'

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