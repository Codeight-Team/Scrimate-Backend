module.exports = app => {
    const matchMaking = require("../controllers/matchMaking.controller");

    var router = require("express").Router();

    router.post('/create-match',);

    app.use('/api/match-making', async (req,res,next) => {
        try {
            await matchMaking.createMatch(req.body.creator_id, req.body.venue_id, req, res);
        } catch (err) {
            next(err)
        }
    })

}