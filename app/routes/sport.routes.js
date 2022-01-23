module.exports = app => {
    const sports = require("../controllers/sport.controller.js");
    const { authJwt } = require("../middleware");

    var router = require("express").Router();

    router.use(function(req,res,next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    })

    // Create a new Tutorial
    router.post("/" , sports.create);

    router.post("/test", sports.SearchIdByName);

    // Retrieve all Tutorials
    router.get("/", sports.findAll);

    // Update a Tutorial with id
    router.put("/:id", sports.update);

    // Delete a Tutorial with id
    router.delete("/:id", sports.delete);

    app.use('/api/sports', router);

}