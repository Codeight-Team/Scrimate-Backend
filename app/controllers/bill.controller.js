const db = require("../models");
const Bill = db.bills;
const Field = db.fields;
const Op = db.Sequelize.Op;

exports.createBill = async (order_id, order_type, req,res) => {
    const field = await Field.findOne({
        raw: true,
        where: {
            field_id: req.params.field_id
        }
    })

    const bill = {
        user_id: req.params.id,
        order_id: order_id,
        bill_amount: order_type == 'Match' ? field.field_price / 2 : field.field_price,
        bill_status: null
    }

    Bill.create(bill)
    .then( () => {
        res.send({
            message: "Bill Created", order_id
        })
    })
    .catch( err => {
        res.status(500).send({
            message: "error while creating bill: " + err.message
        })
    })

}