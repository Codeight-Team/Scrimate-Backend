const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Regist User
exports.createUser = (address_id, req) => {
  
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
      const user = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hashedPass,
          phone_number: req.body.phone_number,
          gender: req.body.gender,
          DOB: req.body.DOB,
          image: req.body.image,
          address_id: address_id
        };
        return User.create(user)
        .then( () => {
            console.log("User Created");
        } )
          .catch((err) => {
            console.log(">> Error while creating tutorial: ", err);
          });
    })
  };

  //Login User
  exports.findOne = (req, res , next) => {
      var email = req.body.email;
      var password = req.body.password;

    User.findOne({where: { email }})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, reslut) {
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(reslut){
                    res.json({
                        message: 'login success'
                    })
                }else{
                    res.json({
                        message: 'email/password doesnt match'
                    })
                }
            })
        }else{
            res.json({
                message: 'email/password doesnt match'
            })
        }
    })

  }