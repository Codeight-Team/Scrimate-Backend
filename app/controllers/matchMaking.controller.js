const db = require("../models");
const MatchMaking = db.matchMaking;
const Op = db.Sequelize.Op;

exports.createMatch = (creator_id, venue_id, req, res) => {
    const matchMaking = {
        payemnt_distribution: req.body.payemnt_distribution,
        date_of_match: req.body.date_of_match,
        creator_id: creator_id,
        venue_id: venue_id
    }

    return MatchMaking.create(matchMaking)
    .then(()=> {
        res.send({ message: "Match Created" })
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}