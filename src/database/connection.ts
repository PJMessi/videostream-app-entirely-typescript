import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import accessEnv from '@helpers/accessEnv';

const DB_URL = accessEnv('DB_URL');

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

const sequelizeOptions: SequelizeOptions = {
  dialectOptions: {
    charset: 'utf8',
    multipleStatements: true,
  },
  logging: false,
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf('.model')) === member.toLowerCase()
    );
  },
};

let sequelize: Sequelize;
if (process.env.NODE_ENV == 'test') {
  sequelize = new Sequelize({
    ...sequelizeOptions,
    dialect: 'sqlite',
    storage: ':memory:',
  });
} else {
  sequelize = new Sequelize(DB_URL, sequelizeOptions);
}

export default sequelize;
