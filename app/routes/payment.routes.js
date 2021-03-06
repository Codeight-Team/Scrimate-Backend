module.exports = app => {

    const midtransController = require("../controllers/midtrans.controller");
    const orderController = require("../controllers/order.controller"); 
    const { verifyPayment } = require("../middleware");


    var router = require("express").Router();

    router.post('/process-order/:id/:bill_id',[verifyPayment.isFieldBooked], async (req, res, next) => {
        midtransController.processOrder(req, res);
    });

    router.post('/payment-handling/', [verifyPayment.checkSignatureKey], midtransController.handlingNotification)

    router.post('/refund/:id/:trans_id' , midtransController.refundProcess)

    app.use('/api/payment', router);
}