const res = require("express/lib/response");
const db = require("../models");
const Venue = db.venues;
const Op = db.Sequelize.Op;

exports.createVenue = (sport_id, address_id, req) => {
    const venue = {
        venue_name: req.body.venue_name,
        venue_type: req.body.venue_type,
        venue_contact: req.body.venue_contact,
        images: req.body.images,
        sport_id : sport_id,
        address_id: address_id
    };

    return Venue.create(venue)
    .then(() => {
        console.log("Venue Created");
    })
    .catch((err)=> {
        console.log(">> Error while creating Venue: ", err);
    });
}
    
