const db = require("../models");
const Order = db.orders;
const Op = db.Sequelize.Op;

//Create order
exports.createOrder = (creator_id, field_id,req,res ) => {
    const order_type = req.body.order_type;
    
    const order = {
        order_status: "On Going",
        order_type: req.body.order_type,
        creator_id: creator_id,
        finder_id: null,
        field_id: field_id,
        date_of_match: req.body.date_of_match,
        time_of_match: req.body.time_of_match,
    };

     return Order.create(order)
    .then( (data) => {
        return data;
    })
    .catch((err) => {
        res.status(500).send({message: "error when creating order= " + err});
    })
    

}

//Find all user order
exports.listMyOrder = (req, res) => {
    const id = req.params.id;

     Order.findAll({
        where: {
            [Op.or]: [{creator_id: id}, {finder_id: id}]
        },
        include: [
            {
                model: db.fields,
                as: "field",
                include: [
                    {
                        model: db.venues,
                        as: "venue"
                    }
                ]
            },
            {
                model: db.bills,
                as: "bills",
                where:{
                    user_id: id
                }
            }
        ]
    })
    .then( (data) => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: "error while getting order this id: " + err.message
        })
    })

}

//find user order with ID
exports.findOrderById = (req, res) => {
    const id = req.params.id;
    const order_id = req.params.order_id;

    Order.findOne({
        raw:true,
        nest: true,
        where: {
            order_id: order_id
        },
        include: [
            {
                model: db.users,
                as: "creator"
            },
            {
                model: db.users,
                as: "finder"
            },
            {
                model: db.bills,
                as: "bills",
                where: {
                    user_id: id
                }
            },
            {
                model: db.fields,
                include: [
                    {
                        model: db.venues,
                        as: "venue",
                        include: [
                            {
                                model: db.address,
                                as: "address"
                            }
                        ]
                    }
                ]
            }
        ]
    })
    .then( (data) => {
         const expire = data.bills.bill_status == "pending" ? data.updatedAt : null;
        if(expire!=null){
            expire.setMinutes(expire.getMinutes() + 15);
        }
        if(data){
            res.send({data, expire});
        }else{
            res.status(400).send({
                message: "Order not found"
            })
        }
    } )
    .catch(err => {
        res.status(500).send({
            message: "Error while find order with this id: " + err.message
        })
    })

}

//FIND UPCOMING ORDER
exports.upcomingOrder = (req,res) => {
    const user_id = req.params.id;

    Order.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { creator_id: user_id },
                        { finder_id: user_id }
                    ],
                },
                {
                    [Op.or]: [
                        { order_status: "Waiting" },
                        { order_status: "On Going" }
                    ]
                }
            ]      
        }
    })
    .then( result => {
        res.send(result)
    } )
    .catch(err => {
        res.status(500).send({ message: "error while getting order: " + err.message})
    })

}

//Find Order History
exports.myOrderHistory = (req,res) => {
    const user_id = req.params.id;
    Order.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { creator_id: user_id },
                        { finder_id: user_id }
                    ]
                },
                {
                    [Op.or]: [
                        { order_status: "Finish" },
                        { order_status: "Cancel" },
                        { order_status: "Refund" },
                    ]
                }
            ]
        },
        include: [
            {
                model: db.fields,
                as: "field"
            }
        ]
    })
    .then((result) => {
        res.send(result)
    })
    .catch(err => {
        res.status(500).send({ message: "error while getting order history: " + err.message})
    })
}

//Update order status
exports.updateStatus = (req, res) => {
    const id = req.params.id;

    Order.update({ order_status: req.body.status }, {
        where: {
            order_id: id
        }
    })
    .then( num => {
        if(num == 1){
            res.send({
                message: "Success update order status"
            })
        }else{
            res.send({
                message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body.status is empty!`
            })
        }
        
    })
    .catch( err => {
        res.status(500).send({
            message: "Error while updating order: " + err.message
        })
    })

}