module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", users.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", async  (req, res , next) => {
      try {
        const id = req.params.id;
        console.log(id);
        const userData = await users.findUserById(id);
        // res.send(userData);
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