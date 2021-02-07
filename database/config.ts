require('dotenv').config();

module.exports.development = {
    dialect: "postgres",
    seederStorage: "sequelize",
    url: process.env.DB_URL  
};

module.exports.production = {
    dialect: "postgres",
    url: process.env.DB_URL  
};

module.exports.test = {
    dialect: "sqlite",
    storage: 'database.sqlite'
};