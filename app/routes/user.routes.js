module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const ratings = require("../controllers/rating.controller");
    const auths = require("../controllers/auth.controller");
  
    var router = require("express").Router();

    router.post("/give-rating", async (req,res, next) => {
      try {
        await ratings.giveRating(req.body.user_id, req.body.venue_id, req, res);
      } catch (err) {
        res.send(err.message);
      }
    });

    router.post("/forgot-password", async (req,res,next) => {
      try {
        const isExist = await users.checkUserExistByEmail(req,res);

        if(isExist == 1)
          await auths.sendRandomPasswordtoEmail(req,res)
      } catch (err) {
        res.status(500).send(err.message)
      }
    })

    router.post("/report/:reporting_id/:reported_id/:match_id", users.reportUser)

    router.post("/change-password/:id", users.changePassword)
  
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
    router.put("/:id", users.upload, users.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", users.delete);
  
    // Create a new Tutorial
    router.delete("/", users.deleteAll);

  
    app.use('/api/users', router);
  };