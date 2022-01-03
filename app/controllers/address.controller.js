const db = require("../models");
const Address = db.address;
const Op = db.Sequelize.Op;

exports.createAddress = (address) => {

    // const addersses = {
    //     address_street: req.body.address_street,
    //     address_city: req.body.address_city,
    //     address_postalcode: req.body.address_postalcode,
    //     address_country: req.body.address_country
    // };

    return Address.create({
        address_street: address.address_street,
        address_city: address.address_city,
        address_postalcode: address.address_postalcode,
        address_country: address.address_country
    })
    .then( 
        console.log("Address created")
     )
      .catch((err) => {
        console.log(">> Error while creating tutorial: ", err);
      });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Address.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find address with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving address with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Address.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "address was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update address with id=${id}. Maybe address was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating address with id=" + id
            });
        });
};