const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an user_id
exports.findUserById = (user_id) => {
  return User.findOne({
    where: {
      user_id: user_id
    },
    attributes: {
      include: 
      [
        [db.sequelize.literal(`(
          SELECT COUNT(*)
          FROM orders as orders
          WHERE orders.user_id = user_id
        )`), 'Match_Played']
      ]
    }
  })
};

// Update a User by the user_id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if(!req.file){
    User.update(req.body, {
      where: { user_id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  }
    if(req.file){
      let path = req.file.path.substr(11)
      const image = {
        image: path
      }
      User.update(image, {
        where: { user_id: id }
      }).then(() => {
        res.send({
          message: "Success update image"
        })
      })
      .catch(err => {
        res.status(500).send({ message: err.message })
      })
    }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'app/assets/images/profile-picture')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + req.params.id + path.extname(file.originalname))
  }
})

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if(mimeType && extname){
      return cb(null, true)
    }
    cb('Give proper file formate')
  }
}).single('image')

// Delete a User with the specified user_id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} User were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};