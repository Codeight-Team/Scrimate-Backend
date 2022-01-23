const db = require("../models");
const Rating = db.ratings;
const Op = db.Sequelize.Op;

exports.giveRating = (user_id, venue_id,req, res) => {
    const rating = {
        user_id : user_id,
        venue_id : venue_id,
        rating_num : req.body.rating_num,
        rating_comment : req.body.rating_comment
    }

    return Rating.create(rating)
    .then(()=> {
        res.send("Rating Stored");
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}