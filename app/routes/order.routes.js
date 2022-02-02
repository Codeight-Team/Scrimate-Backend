module.exports = app => {

    const orderController = require("../controllers/order.controller");
    const billController = require("../controllers/bill.controller");


    var router = require("express").Router();

    router.post('/create-order/:id/:field_id', async (req, res, next) => {

        const order = await orderController.createOrder(req.params.id, req.params.field_id, req, res);

        billController.createBill(order.order_id, req, res)


    });

    router.post('/find-my-order/:id', orderController.findMyOrder)

    router.post('/find-a-order/:id', orderController.findOrderById);

    router.put('/update-status/:id', function (req, res) {
        orderController.updateStatus
    })

    app.use('/api/order', router);

}