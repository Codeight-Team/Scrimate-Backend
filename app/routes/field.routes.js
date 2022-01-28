module.exports = app => {
    const fieldController = require("../controllers/field.controller");
    var router = require("express").Router();

    router.post('/create-field/:id', fieldController.createField )
    router.get('/get-fields/:id', fieldController.getFields);

    app.use('/api/field', router)
}