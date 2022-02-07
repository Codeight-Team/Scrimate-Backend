module.exports = app => {
    const matchMaking = require("../controllers/matchMaking.controller");
    const Order = require("../controllers/order.controller");
    const Bill = require("../controllers/bill.controller");
    const axios = require('axios');
    

    var router = require("express").Router();

    router.post('/create-match/:id/:field_id', matchMaking.createMatch);
    router.post('/list-match/:id', matchMaking.listMatch);
    router.get('/my-match/:id', matchMaking.myMatch);
    router.get('/match-detail/:id', matchMaking.getMatchDetail);
    router.put('/join/:id/:match_id', async (req,res) => {
        const order = await matchMaking.findOrderByMatch(req, res);
        matchMaking.joinMatch(req);
        const bill = await Bill.createBill(order.order_id, order.order_type, req, res);
        const payment_method = {
            payment_method: req.body.payment_method
        }

        await axios.post(`http://66.42.49.240/api/payment/process-order/${req.params.id}/${bill.bill_id}`, payment_method);
        res.send({ message: "Success Join. Please pay the bill" });
        
    });

    app.use('/api/match-making', router)

}