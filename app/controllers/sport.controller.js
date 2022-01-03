const db = require("../models");
const Sport = db.sports;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.sport_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const sport = {
    sport_name: req.body.sport_name,
    player_number: req.body.player_number
  };

  // Save Tutorial in the database
  Sport.create(sport)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const sport = req.query.title;
    var condition = sport ? { sport: { [Op.iLike]: `%${sport}%` } } : null;
  
    Sport.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving sports."
        });
      });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Sport.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Sport was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Sport with id=${id}. Maybe Sport was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Sport with id=" + id
        });
      });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sport.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Sport was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Sport with id=${id}. Maybe Sport was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Sport with id=" + id
        });
      });
};