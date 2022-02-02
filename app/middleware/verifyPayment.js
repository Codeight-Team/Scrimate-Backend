const db = require("../models");
const Bill = db.bills;
const Field = db.fields;
const Op = db.Sequelize.Op;

isFieldBooked = async (req, res , next) => {
    const bill = await Bill.findOne({
        raw: true,
        nest: true,
        where: {
            bill_id: {
                [Op.eq]: req.params.bill_id
            }
        },
        attributes: [
            'order_id'
        ],
        include: [
            {
                model: db.orders,
                attributes: [
                    'date_of_match',
                    'time_of_match'
                ]
            }
        ]
    })

    const billBooked = Bill.findAll({
        raw: true,
        nest: true,
        where: {
            bill_id: {
                [Op.ne]: req.params.bill_id
            },
            bill_status: {
                [Op.eq] : "pending"
            },
            '$order.date_of_match$': {
                [Op.eq]: bill.order.date_of_match
            }, 
            '$order.time_match$': {
                [Op.eq]: bill.order.time_of_match
            }
        },
        include: [
            {
                model: db.orders,
                as: "order"
            }
        ]
    })

    const scheduleBooked = Field.findAll({
        raw: true,
        nest: true,
        where: {
            '$schedule.schedule_date$': {
                [Op.eq]: bill.order.date_of_match
            },
            '$schedule.schedule_time$': {
                [Op.eq]: bill.order.time_of_match
            }
        },
        include: [
            {
                model: db.schedules,
                as: "schedule"
            }
        ]
    })

    if(billBooked != null){
        return res.status(406).send({
            message: "Cannot process, There are already bill on progress"
        })
    }else if (scheduleBooked != null){
        return res.status(406).send({
            message: "Cannot process, field with specific time already booked"
        })
    }

    next();
    
}

const verifyPayment = {
    isFieldBooked: isFieldBooked,
};

module.exports =  verifyPayment;