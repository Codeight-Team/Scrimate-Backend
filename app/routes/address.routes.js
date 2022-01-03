module.exports = app => {
    const address = require("../controllers/address.controller.js");

    var router = require("express").Router();

    // Retrieve a single Tutorial with id
    router.get("/:id", address.findOne);

    // Update a Tutorial with id
    router.put("/:id", address.update);

    app.use('/api/address', router);

}