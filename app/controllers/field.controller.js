const db = require("../models");
const Field = db.fields;
const Op = db.Sequelize.Op;

exports.createField = (venue_id, req, res) => {
    const field = {
        field_name: req.body.field_name,
        venue_id: venue_id,
    }

    return Field.create(field)
    .then(() => {
        res.send({ message: "Field Created"});
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    });
}