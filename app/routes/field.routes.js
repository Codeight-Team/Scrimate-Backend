
module.exports = app => {
    const fieldController = require("../controllers/field.controller");
    var router = require("express").Router();
    var multer = require("multer");

    router.post('/create-field/:id', fieldController.upload , async (req, res , next) => {
        multer().array();
        fieldController.createField(req,res);
    } )
    router.get('/get-fields/:id', fieldController.getFields);

    app.use('/api/field', router)
}