const db = require("../models");
const Bill = db.bills;
const Field = db.fields;
const Order = db.orders;
const Op = db.Sequelize.Op;

exports.createBill = async (order_id, order_type, req,res) => {
    var field = null;
    if(req.params.field_id){
        field = await Field.findOne({
            raw: true,
            where: {
                field_id: req.params.field_id
            }
        })
    }

    if(req.params.match_id){
        var tempField = await Order.findOne({
            raw: true,
            where: {
                order_id: order_id
            }
        })
        field = await Field.findOne({
            raw: true,
            where: {
                field_id: {
                    [Op.eq]: tempField.field_id
                }
            }
        })
    }
    

    const bill = {
        user_id: req.params.id,
        order_id: order_id,
        bill_amount: order_type == 'Match' ? field.field_price / 2 : field.field_price,
        bill_status: null
    }

    return Bill.create(bill)
    .then( (data) => {
        return data;
    })
    .catch( err => {
        res.status(500).send({
            message: "error while creating bill: " + err.message
        })
    })

}