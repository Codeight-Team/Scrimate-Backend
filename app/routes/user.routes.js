module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const ratings = require("../controllers/rating.controller");
  
    var router = require("express").Router();

    router.post("/give-rating", async (req,res, next) => {
      try {
        await ratings.giveRating(req.body.user_id, req.body.venue_id, req, res);
      } catch (err) {
        res.send(err.message);
      }
    });
  
    // Retrieve all Tutorials
    router.get("/", users.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", async  (req, res , next) => {
      try {
        const id = req.params.id;
        console.log(id);
        const userData = await users.findUserById(id);
        res.send({userData});
        console.log(
          JSON.stringify(userData, null, 2)
        );
      } catch (err) {
        return next(err);
      }
    });
  
    // Update a Tutorial with id
    router.put("/:id", users.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", users.delete);
  
    // Create a new Tutorial
    router.delete("/", users.deleteAll);

  
    app.use('/api/users', router);
  };