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
db.venues = require("./venue.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.roles = require("./role.model")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model")(sequelize, Sequelize);

//RELATION

//ADDRESS RELATION
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
//-------------------------------------------------

//VENUE RELATION
//1. VENUE - SPORT
db.sports.hasMany(db.venues, {
  as: "venue",
  foreignKey: {
    name: "sport_id",
    allowNull: false
  }
});
db.venues.belongsTo(db.sports, {
  foreignKey: {
    name: "sport_id",
    as: "sport",
    allowNull: false
  }
});
//2. Venue - ADDRESS
db.address.hasMany(db.venues, {
  as: "venue",
  foreignKey: {
    name: "address_id",
    allowNull: false
  }
});
db.venues.belongsTo(db.address, {
  foreignKey: {
    name: "address_id",
    as: "address",
    allowNull: false
  }
});
//-------------------------------------------

//ORDER RELATION
//1. order - user
db.users.hasMany(db.orders, {
  as: "order",
  foreignKey: {
    name: "user_id",
    allowNull: false
  }
});
db.orders.belongsTo(db.users, {
  foreignKey: {
    name: "user_id",
    as: "user",
    allowNull: false
  }
});
//2. order - sports
db.sports.hasOne(db.orders, {
  as: "order",
  foreignKey: {
    name: "sport_id",
    allowNull: false
  }
});
db.orders.belongsTo(db.sports, {
  foreignKey: {
    name: "sport_id",
    as: "sport",
    allowNull: false
  }
});
//3. order - venue
db.venues.hasOne(db.orders, {
  as: "order",
  foreignKey: {
    name: "venue_id",
    allowNull: false
  }
});
db.orders.belongsTo(db.venues, {
  foreignKey: {
    name: "venue_id",
    as: "venue",
    allowNull: false
  }
});
//-------------------------

//ROLE RELATIONS
db.roles.belongsToMany(db.users, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});
db.users.belongsToMany(db.roles, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "role"
});
//----------------------------------------------

//REFRESH TOKEN RELATIONS
db.refreshToken.belongsTo(db.users, {
  foreignKey: 'user_id', targetKey: 'user_id'
});
db.users.hasOne(db.refreshToken, {
  foreignKey: 'user_id', targetKey: 'user_id'
});
//----------------------------------------------

db.ROLES = ["user", "admin"];

module.exports = db;