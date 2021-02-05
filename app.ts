import express from 'express';
import router from './routes';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

app.use(router);
app.use(errorMiddleware);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});