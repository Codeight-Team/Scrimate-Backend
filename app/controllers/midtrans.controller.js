const midtransClient = require('midtrans-client');
const axios = require('axios');
const db = require("../models");
const User = db.users;
const Bill = db.bills;
const Order = db.orders;
const Transaction = db.transactions;
const Field = db.fields;
const Schedule = db.schedules;
const Op = db.Sequelize.Op;

exports.processOrder = async (req, res) => {

    const customer = await User.findOne({
        raw: true,
        where: {
            user_id: {
                [Op.eq]: req.params.id
            }
        },
    })

    const bill = await Bill.findOne({
        raw: true,
        nest: true,
        where: {
            bill_id: {
                [Op.eq]: req.params.bill_id
            }
        },
        include: [
            {
                model: db.orders,
                include: [
                    {
                        model: db.fields,
                        include: [
                            {
                                model: db.venues,
                            }
                        ]
                    }
                ]
            }
        ]
    })

    let parameter = {
        "payment_type": "bank_transfer",
        "transaction_details": {
            "order_id": req.params.bill_id,
            "gross_amount": bill.order.field.field_price
        },
        "item_details": [{
            "id": bill.order.field.field_id,
            "price": bill.order.field.field_price,
            "quantity": 1,
            "name": bill.order.field.field_name,
            "merchant_name": bill.order.field.venue.venue_name
        }],
        "customer_details": {
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": customer.email,
            "phone": customer.phone_number,
        },
        "bank_transfer": {
            "bank": req.body.payment_method
        }
    };

    await axios.post('https://api.sandbox.midtrans.com/v2/charge', parameter, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic U0ItTWlkLXNlcnZlci00MU02aW9la3VwSTVBNms0ZENmTV8wcHk6'
        }
    })
        .then((response) => {
            res.status(response.data.status_code).send(response.data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })

}

exports.handlingNotification = (req, res) => {
    const transaction_status = req.body.transaction_status;

    const pendingHandling = async function () {
        const va_num = req.body.va_numbers[req.body.va_numbers.length - 1].va_number;
        Bill.update({ bill_status: transaction_status, bill_va_num: va_num }, {
            where: {
                bill_id: {
                    [Op.eq]: req.body.order_id
                }
            }
        })
    }

    const expireHandling = async function () {
        Bill.update({ bill_status: transaction_status, bill_va_num: "" }, {
            where: {
                bill_id: {
                    [Op.eq]: req.body.order_id
                }
            }
        })
        .then((bill) => {
            Order.findOne({
                where: {
                    order_id: {
                        [Op.eq]: bill.order_id
                    }
                }
            })
            .then((order)=> {
                if(order.order_type=="Match"){
                    if(order.finder_id == bill.user_id){
                        order.update({finder_id: null})
                    }
                }
            })
        })
    }

    const settlementHandling = async function () {
        Bill.update({ bill_status: transaction_status }, {
            where: {
                bill_id: {
                    [Op.eq]: req.body.order_id
                }
            }
        })
            .then((bill) => {
                Order.findOne({
                    where: {
                        order_id: {
                            [Op.eq]: bill.order_id
                        }
                    }
                })
                    .then((order) => {
                        if (order.order_type == "Single") {
                            order.update({order_status: "Finish"})
                            .then(()  => {
                                Field.findByPk(order.field_id)
                                .then((field) => {
                                    Schedule.create({
                                        schedule_date: order.date_of_match,
                                        schedule_time: order.time_of_match,
                                        generate: "app"
                                    })
                                    .then((schedule) => {
                                        field.addSchedule(schedule);
                                    })
                                })
                            })
                        }else if(order.order_type == "Match"){
                            if(order.finder_id == null) {
                                order.update({order_status: "Waiting"})
                            } else{
                                order.update({order_status: "Finish"})
                                .then(()  => {
                                    Field.findByPk(order.field_id)
                                    .then((field) => {
                                        Schedule.create({
                                            schedule_date: order.date_of_match,
                                            schedule_time: order.time_of_match,
                                            generate: "app"
                                        })
                                        .then((schedule) => {
                                            field.addSchedule(schedule);
                                        })
                                    })
                                })
                            }
                        }
                    })

                Transaction.create({
                    transaction_time: req.body.settlement_time,
                    bill_id: bill.id
                })
            })
    }

    const cancelHandling = async function () {
        Bill.update({ bill_status: transaction_status, bill_va_num: "" }, {
            where: {
                bill_id: {
                    [Op.eq]: req.body.order_id
                }
            }
        })
    }

    switch (transaction_status) {
        case "pending":
            pendingHandling();
            break;
        case "expire":
            expireHandling();
            break;
        case "settlement":
            settlementHandling();
            break;
        case "cancel":
            cancelHandling();
            break;
    }

}