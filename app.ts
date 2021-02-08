import "module-alias/register";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routes';
import errorMiddleware from '@middlewares/error.middleware';
import sequelize from '@root/src/database/connection'

const app = express();
app.use(express.json());

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