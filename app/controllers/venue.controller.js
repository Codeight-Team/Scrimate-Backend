const db = require("../models");
const Venue = db.venues;
const Operational = db.operationals;
const Op = db.Sequelize.Op;

exports.createVenue = (sport_id, address_id, req, res) => {
    const venue = {
        venue_name: req.body.venue_name,
        venue_facility: req.body.venue_facility,
        venue_description: req.body.venue_description,
        images: req.body.images,
        isOpen: req.body.isOpen,
        sport_id: sport_id,
        address_id: address_id
    };

    return Venue.create(venue)
        .then(async venues => {
            res.send("Venue Created");
            await Operational.createOperationalHour(venues.venue_id, req);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.findIdByName = (req) => {
    var venue_name = req.body.venue_name;

    return Venue.findOne({ where: { venue_name: venue_name } })
        .then(name => {
            return name.venue_id;
        });

}

exports.getVenueBySportAndRegion = (req) => {
    var sport_name = req.body.sport_name;
    var address_region = req.body.address_region;

    return Venue.findAll({
        where: {
            isOpen: true
        },
        attributes: {
            include:
                [
                    [db.sequelize.literal(`(
                            SELECT ROUND(AVG(rating_num)) as average
                            FROM ratings
                            WHERE ratings.venue_id = venue.venue_id
                        )`), 'Average']
                ],
        },
        include: [
            {
                model: db.address,
                as: 'address',
                where: {
                    address_region: address_region
                }
            },
            {
                model: db.sports,
                as: 'sport',
                where: {
                    sport_name: sport_name
                }
            },
            {
                model: db.ratings,
                as: 'venue_rating',
                //separate: true,


            },


        ],
    });

}
