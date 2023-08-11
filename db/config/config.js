require('dotenv-flow').config(); //instatiate environment variables


module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": 'localhost',
    "db_port": process.env.DB_PORT ||  process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT || "mysql",
    "underscored": true,
    "freezeTableName": true,
    "charset": process.env.DB_CHARSET || "utf8",
    "collate": process.env.DB_COLLATE || "utf8mb4_general_ci",
    "timezone": process.env.DB_TIMEZONE || "+01:00",
    "logging": console.log
  },
  "test": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "db_port": "3306",
    "dialect": "mysql",
    "underscored": true,
    "freezeTableName": true,
    "charset": process.env.DB_CHARSET || "utf8",
    "collate": process.env.DB_COLLATE || "utf8mb4_general_ci",
    "timezone": process.env.DB_TIMEZONE || "+01:00",
    "logging": console.log
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT || "3306",
    "dialect": process.env.DB_DIALECT || "mysql",
    "underscored": true,
    "freezeTableName": true,
    "charset": process.env.DB_CHARSET || "utf8",
    "collate": process.env.DB_COLLATE || "utf8mb4_general_ci",
    "timezone": process.env.DB_TIMEZONE || "+01:00",
    "logging": console.log
  }
};