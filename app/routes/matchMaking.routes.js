module.exports = app => {
    const matchMaking = require("../controllers/matchMaking.controller");
    const Order = require("../controllers/order.controller");
    const Bill = require("../controllers/bill.controller");

    var router = require("express").Router();

    router.post('/create-match/:id/:field_id', matchMaking.createMatch);
    router.post('/list-match/:id', matchMaking.listMatch);
    router.get('/match-detail/:id', matchMaking.getMatchDetail);
    router.put('/join/:id/:match_id', async (req,res) => {
        const order = await matchMaking.findOrderByMatch(req);

        Bill.createBill(order.order_id, order.order_type, req)

        matchMaking.joinMatch(req);
        

    });

    app.use('/api/match-making', router)

}