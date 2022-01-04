module.exports = app => {
    const sports = require("../controllers/sport.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", sports.create);

    router.post("/test", sports.SearchIdByName);

    // Retrieve all Tutorials
    router.get("/", sports.findAll);

    // Update a Tutorial with id
    router.put("/:id", sports.update);

    // Delete a Tutorial with id
    router.delete("/:id", sports.delete);

    app.use('/api/sports', router);

}