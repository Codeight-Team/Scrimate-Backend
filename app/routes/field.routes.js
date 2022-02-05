
module.exports = app => {
    const fieldController = require("../controllers/field.controller");
    var router = require("express").Router();
    var multer = require("multer");

    router.post('/create-field/:id', fieldController.upload , async (req, res , next) => {
        try {
            multer().array();
            fieldController.createField(req,res);
        } catch (err) {
            return next(err);
        }
    } )
    router.get('/get-fields/:id', fieldController.getFields);
    router.post('/field-schedule/:id', fieldController.getFieldSchedule);

    app.use('/api/field', router)
}