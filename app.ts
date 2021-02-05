import express from 'express';
import router from './routes';
import errorMiddleware from './middlewares/error.middleware';
import { sequelize } from './database';

const app = express();

app.use(router);

app.use(errorMiddleware);


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);

    sequelize.authenticate().then(() => {
        console.log("Connected to database.");

    }).catch((error: any) => {
        console.log(error);
        console.log("Could not connecte to database.");
    });
});