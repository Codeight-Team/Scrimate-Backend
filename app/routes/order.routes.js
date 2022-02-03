module.exports = app => {

    const orderController = require("../controllers/order.controller");
    const billController = require("../controllers/bill.controller");


    var router = require("express").Router();

    router.post('/create-order/:id/:field_id', async (req, res, next) => {

        const order = await orderController.createOrder(req.params.id, req.params.field_id, req, res);

        billController.createBill(order.order_id, req, res)


    });

    router.get('/find-upcoming-order/:id', 
        orderController.upcomingOrder )

    router.get('/find-my-order/:id', orderController.listMyOrder)

    router.get('/find-a-order/:id/:order_id', orderController.findOrderById);

    router.get('/find-order-history/:id', orderController.myOrderHistory)

    router.put('/update-status/:id', orderController.updateStatus)

    app.use('/api/order', router);

}