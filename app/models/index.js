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
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.sports = require("./sport.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);
db.venues = require("./venue.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.roles = require("./role.model")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model")(sequelize, Sequelize);
db.matchMaking = require("./matchMaking.model")(sequelize, Sequelize);
db.fields = require("./field.model")(sequelize, Sequelize);
db.schedules = require("./schedule.model")(sequelize, Sequelize);
db.operationals = require("./operational.model")(sequelize, Sequelize);
db.ratings = require("./rating.model")(sequelize, Sequelize);
db.conversations = require("./conversation.model")(mongoose);
db.messages = require("./message.model")(mongoose);


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
  as: "venues",
  foreignKey: {
    name: "sport_id",
    allowNull: false
  }
});
db.venues.belongsTo(db.sports, {
  foreignKey: {
    name: "sport_id",
    allowNull: false
  },
});
//2. Venue - ADDRESS
db.address.hasOne(db.venues, {
  foreignKey: {
    name: "address_id",
    allowNull: false
  },
  
});
db.venues.belongsTo(db.address, {
  foreignKey: {
    name: "address_id",
    allowNull: false
  },
  onDelete: 'cascade',
  hooks: true
});
//3. Venue - User
db.users.hasMany(db.venues, {
  foreignKey: {
    name: "user_id",
    allowNull: false
  }
})
db.venues.belongsTo(db.users, {
  foreignKey: {
    name: "user_id",
    allowNull: false
  }
})
//-------------------------------------------
//OPERATIONAL RELATION
db.venues.hasMany(db.operationals, {
  foreignKey: {
    name: "venue_id",
    allowNull: false
  }
})
//-------------------------------------------
//Field RELATION

db.venues.hasMany(db.fields, {
  as: "field",
  foreignKey: {
    name: "venue_id",
    allowNull: false
  }
});
db.fields.belongsTo(db.venues, {
  foreignKey: {
    name: "venue_id",
    allowNull: false
  }
});
//-------------------------------------------
//SCHEDULE RELATION
db.schedules.belongsToMany(db.fields, {
  through: "field_schedule",
  foreignKey: "schedule_id",
  otherKey: "field_id",
  as: "field"
});
db.fields.belongsToMany(db.schedules, {
  through: "field_schedule",
  foreignKey: "field_id",
  otherKey: "schedule_id",
  as: "schedule"
});
//-------------------------------------------
//MATCHMAKING RELATION
db.users.hasMany(db.matchMaking, {
  foreignKey: {
    name: "creator_id",
    allowNull: false
  },
  as: "creator"
})
db.users.hasMany(db.matchMaking, {
  foreignKey: {
    name: "finder_id",
    allowNull: true
  },
  as: "finder"
})
db.fields.hasMany(db.matchMaking,{
  foreignKey: {
    name: "field_id",
    allowNull: false
  },
  as: "field"
})
db.matchMaking.belongsTo(db.users, {
  foreignKey: {
    name: "creator_id",
    allowNull: false
  },
  otherKey: {
    name: "finder_id",
    allowNull: true
  }
})
db.matchMaking.belongsTo(db.fields, {
  foreignKey: {
    name: "field_id",
    allowNull: false
  }
})
//-------------------------------------------
//RATING RELATION
db.ratings.belongsTo(db.users, {
  foreignKey: {
    name: "user_id",
    allowNull: false
  }
})
db.ratings.belongsTo(db.venues, {
  foreignKey: {
    name: "venue_id",
    allowNull: false
  }
})
db.users.hasMany(db.ratings, {
  foreignKey: {
    name: "user_id",
    allowNull: false
  },
  as: 'user_rating'
})
db.venues.hasMany(db.ratings, {
  foreignKey: {
    name: "venue_id",
    allowNull: false
  },
  as: 'venue_rating'
})
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

db.ROLES = ["user", "admin", "host"];

module.exports = db;