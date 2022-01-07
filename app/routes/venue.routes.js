module.exports = app => {

    const venueController = require("../controllers/venue.controller");
    const addressController = require("../controllers/address.controller");
    const sportController = require('../controllers/sport.controller');

    var router = require("express").Router();

    router.post('/insert-new-venue', async (req, res, next) => {
        try {
            const address = await addressController.createAddress({
                address_street: req.body.address_street,
                address_city: req.body.address_city,
                address_postalcode: req.body.address_postalcode,
                address_country: req.body.address_country
            });
            const idSport = await sportController.SearchIdByName(req);
            console.log("ID SPORT =" + idSport)
            const venue = await venueController.createVenue(idSport, address.address_id, req);
            res.send({address, venue});
        } catch (err) {
            return next(err);
        }
    } );

    app.use('/api/venue', router);


}