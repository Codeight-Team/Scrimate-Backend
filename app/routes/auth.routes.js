module.exports = app => {
    const authController = require("../controllers/auth.controller.js");
    const addressController = require("../controllers/address.controller.js");

    var router = require("express").Router();

    router.post('/register', async (req, res, next) => {
        try {
            const address = await addressController.createAddress({
                address_street: req.body.address_street,
                address_city: req.body.address_city,
                address_postalcode: req.body.address_postalcode,
                address_country: req.body.address_country
            });

            const auth = await authController.createUser(address.address_id, req);
            res.send({ address, auth });
        } catch (err) {
            return next(err);
        }
    });
    router.post('/login', authController.findOne)

    app.use('/api/auth', router);

}