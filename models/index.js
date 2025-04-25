const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port: dbConfig.PORT,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
  }
);

// Define models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Video = require('./video.model')(sequelize, DataTypes);

module.exports = db;
