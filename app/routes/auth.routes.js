module.exports = app => {
    const authController = require("../controllers/auth.controller.js");
    const addressController = require("../controllers/address.controller.js");
    const { verifySignup } = require("../middleware");

    var router = require("express").Router();

    router.use(function(req,res,next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    })

    router.post('/register', [verifySignup.checkIfEmailIsDuplicate, verifySignup.checkRolesExisted], async (req, res, next) => {
        try {
            const address = await addressController.createAddress({
                address_street: req.body.address_street,
                address_region: req.body.address_region,
                address_city: req.body.address_city,
                address_postalcode: req.body.address_postalcode,
                address_country: req.body.address_country
            });

            const auth = authController.createUser(address.address_id, req, res);

        } catch (err) {
            return next(err);
        }
    });
    router.post('/login', authController.findOne)
    router.post('/refreshToken', authController.refreshToken)

    router.post('/sendOTP/:id', async(req,res, next) => {
        await authController.sendOTPVerif(req.params.id, req.body.email, res);
    });

    router.post('/verifyOTP/:id', authController.verifyAccount);

    router.post('/resendOTP/:id', async(req,res,next) => {
        await authController.resendOTP(req,res);
        await authController.sendOTPVerif(req.params.id, req.body.email, res)
    })

    app.use('/api/auth', router);

}