const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//static image folder
app.use('/images/profile-picture', express.static('./app/assets/images/profile-picture'));
app.use('/images/venues', express.static('./app/assets/images/venues'));
app.use('/images/fields', express.static('./app/assets/images/fields'));


const db = require("./app/models");
const Role = db.roles;
// db.sequelize.sync();
//In development, you may need to drop existing tables and re-sync database. Just use force: true as following code:
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to backend service for scrimate app." });
});

require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/address.routes")(app);
require("./app/routes/sport.routes")(app);
require("./app/routes/venue.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/field.routes")(app);
require("./app/routes/matchMaking.routes")(app);
require("./app/routes/messager.routes")(app);
require("./app/routes/payment.routes")(app);




// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    name: "user"
  });

  Role.create({
    name: "admin"
  });

  Role.create({
    name: "host"
  });
}