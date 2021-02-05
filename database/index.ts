import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize('videostream-typescript', 'postgres', 'myfamily10', {
    host: 'localhost',
    dialect: 'postgres',
    models: [__dirname + '/models']
});