const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.sports = require("./sport.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);

db.address.hasMany(db.users, {
  as: "user",
  foreignKey: {
    name: "address_id",
    allowNull: false
  }
});
db.users.belongsTo(db.address, {
  foreignKey: {
    name: "address_id",
    as: "address",
    allowNull: false
  }
});

module.exports = db;