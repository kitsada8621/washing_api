require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'washing_db',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    createDatabaseIfNotExist: true,
    logging: false,
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    createDatabaseIfNotExist: true,
    logging: false,
    dialectOptions: {
      bigNumberStrings: true,
    },
  }
};