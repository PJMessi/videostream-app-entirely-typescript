import { Sequelize } from 'sequelize-typescript';
import accessEnv from '#root/helpers/accessEnv';

const DB_URL = accessEnv("DB_URL");

// const sequelize =  new Sequelize({
//     database: 'videostream-typescript',
//     dialect: 'postgres',
//     username: 'postgres',
//     password: 'myfamily10',
//     models: [__dirname + '/models'], // or [Player, Team],
//     modelMatch: (filename, member) => {
//         return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
//     },
// });


const sequelize = new Sequelize(DB_URL, {
    dialectOptions: {
        charset: "utf8",
        multipleStatements: true
    },
    logging: false,
    models: [__dirname + '/models'],
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
});

export default sequelize;   