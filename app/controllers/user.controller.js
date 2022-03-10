const db = require("../models");
const User = db.users;
const MatchMaking = db.matchMaking;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

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
exports.findUserById  = (user_id) => {
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
          WHERE orders.creator_id = user_id OR orders.finder_id = user_id
        )`), 'Match_Played']
        ]
    },
    include: [
      {
        model: db.address,
        attributes: [
          'address_region'
        ]
      }
    ]
  })
};

// Update a User by the user_id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.file) {
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
  if (req.file) {
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

    if (mimeType && extname) {
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

exports.checkUserExistByEmail = (req, res) => {
  const email = req.body.email;

  return User.findOne({
    where: {
      email: email
    }
  })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "Account doesnt exist" })
      } else {
        return 1;
      }
    })

}

exports.changePassword = (req, res) => {
  const user_id = req.params.id;

  User.findOne({
    where: {
      user_id: user_id
    }
  })
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "There is no account with this email"
        })
      } else {
        var hashedPass = bcrypt.hashSync(password, 10);
        result.update({ password: hashedPass });
        res.send("Success change account password")
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })

}

exports.reportUser = (req, res) => {

  const match_id = req.params.match_id;
  const reporting_id = req.params.reporting_id;
  const reported_id = req.params.reported_id;
  const reason = req.body.report_reason;

  MatchMaking.findOne({
    where: {
      match_id: match_id
    }
  })
    .then((match) => {
      if ((match.creator_id == reporting_id || match.creator_id == reported_id) && (match.finder_id == reporting_id || match.finder_id == reported_id)) {
        User.findOne({
          where: {
            user_id: reporting_id
          }
        })
          .then((reporting) => {
            if (!reporting) {
              res.status(404).send({
                message: "User who report doesnt exist"
              })
            } else {
              User.findOne({
                where: {
                  user_id: reported_id
                }
              })
                .then((reported) => {
                  if (!reported) {
                    res.status(404).send({
                      message: "Reported user doesnt exist"
                    })
                  } else {
                    reporting.addReported(reported, {
                      through: {
                        report_reason: reason,
                        match_id: match_id
                      }
                    })
                    res.send({ message: "Report Success" })
                  }
                })
                .catch(err => {
                  res.status(500).send(err.message)
                })
            }
          })
          .catch(err => {
            res.status(500).send(err.message)
          })
      } else {
        res.status(402).send({
          message: "Users and matchmaking doesnt match"
        })
      }
    })
    .catch(err => {
      res.status(500).send(err.message)
    })
}