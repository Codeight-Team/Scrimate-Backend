module.exports = app => {

    const midtransController = require("../controllers/midtrans.controller");
    const orderController = require("../controllers/order.controller"); 
    const { verifyPayment } = require("../middleware");


    var router = require("express").Router();

    router.get('/process-order/:id/:bill_id',[verifyPayment.isFieldBooked], async (req, res, next) => {
        midtransController.processOrder(req, res);
    });

    router.post('/payment-handling/', midtransController.handlingNotification)

    app.use('/api/payment', router);
}