module.exports = app => {
    const db = require("../models");
    const Operational = db.operationals;


    const venueController = require("../controllers/venue.controller");
    const addressController = require("../controllers/address.controller");
    const sportController = require('../controllers/sport.controller');
    
    var multer = require('multer');


    var router = require("express").Router();

    router.post('/insert-new-venue/:id', venueController.upload , async (req, res, next) => {
        try {
            multer().array();
            const address = await addressController.createAddress({
                address_street: req.body.address_street,
                address_region: req.body.address_region,
                address_city: "DKI Jakarta",
                address_postalcode: req.body.address_postalcode,
                address_country: req.body.address_country
            });
            const idSport = await sportController.SearchIdByName(req);
            await venueController.createVenue(idSport, address.address_id, req, res);
        } catch (err) {
            return next(err);
        }
    } );

    router.post('/create-operationalhour/:id', Operational.createOperationalHour)

    router.post('/get-venue/:sport/:region', venueController.getVenueBySportAndRegion)

    router.get('/get-my-venue/:id', venueController.getMyVenue)

    router.get('/venue-detail/:id', venueController.venueDetail)

    router.put('/update-status/:id', venueController.statusVenue)

    //delete a venue
    router.delete('/delete-a-venue/:id', venueController.delete);

    app.use('/api/venue', router);


}