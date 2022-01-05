module.exports = app => {

    const orderController = require("../controllers/order.controller");
    const sportController = require("../controllers/sport.controller");
    const venueController = require("../controllers/venue.controller");

    

    var router = require("express").Router();

    router.post('/create-order', async (req, res, next) => {
        try {
            const idSport = await sportController.SearchIdByName(req);
            const idVenue = await venueController.findIdByName(req);

            const order = await orderController.createOrder(req.body.user_id , idVenue, idSport, req);
            res.send(order);

        } catch (err) {
            next(err)
        }

    });

    router.post('/find-a-order', async (req,res, next) => {
        try {
            const order = await orderController.findOrderById(req.body.order_id);
            res.send({order});
        } catch (err) {
            next(err)
        }
    });

    app.use('/api/order', router);

}