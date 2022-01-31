module.exports = app => {

    const midtrans = require("../controllers/midtrans.controller");

    var router = require("express").Router();

    router.get('/get-token', midtrans.getSnapToken);

    app.use('/api/payment', router);
}