const db = require("../models");
const Order = db.orders;
const Op = db.Sequelize.Op;

exports.createOrder = (user_id, venue_id, sport_id,req) => {
    
    const order = {
        order_type: req.body.order_type,
        user_id: user_id,
        venue_id: venue_id,
        sport_id: sport_id
    };

    return Order.create(order)
    .then(() => {
        console.log("Order Created");
    })
    .catch((err) => {
        console.log("error when creating order= ", err);
    })
    

}

exports.findOrderById = (order_id) => {
    return Order.findByPk(order_id, { include: ["venue", "sport"] })
    .then((order) => {
      return order;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
}