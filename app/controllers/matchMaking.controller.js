const db = require("../models");
const MatchMaking = db.matchMaking;
const Order = db.orders;
const Op = db.Sequelize.Op;

exports.createMatch = (req, res) => {
    const matchMaking = {
        payment_distribution: 50,
        date_of_match: req.body.date_of_match,
        time_of_match: req.body.time_of_match,
        creator_id: req.params.id,
        field_id: req.params.field_id
    }

    return MatchMaking.create(matchMaking)
    .then(()=> {
        res.send({ message: "Match Created" })
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}

exports.joinMatch = (req, res) => {
    const id = req.params.id;
    const match_id = req.params.match_id;

    MatchMaking.update({finder_id: id}, {
        where: {
            match_id: match_id
        }
    })
    .then( () => {
        console.log("Success");
    })
    .catch(err => {
        res.status(500).send({
            message: "Failed to join a match: " + err.message
        })
    })
}

exports.findOrderByMatch = (req,res) => {
    const match_id = req.params.match_id;
    const user_id = req.params.id;

    return Order.findOne({
        // where: {
        //     '$match.match_id$': match_id,
        // },
        include: [
            {
                model:  db.matchMaking,
                as: "match",
                where: {
                    match_id: match_id
                }
            }
        ]
    })
    .then((order) =>{
        order.update({ finder_id: user_id });
        return order;
    })

}

exports.updateMatch = (req, res) => {
    const id = req.params.id;

    MatchMaking.update(req.body, {
        where: {
            match_id: id
        }
    })
    .then( update => {
        if(update == 1){
            res.send({ message: "Match updated" });
        }else{
            res.send({
                message: `Cannot update match with id=${id}. Maybe Match was not found or req.body is empty!`
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating match"
        })
    });

}

exports.deleteMatch = (req, res) => {
    const id = req.params.id;

    MatchMaking.destory({
        where: {
            match_id: id
        }
    })
    .then(match => {
        if(match == 1){
            res.send({ message: "Succes delete a match with id:" + id })
        }else{
            res.send({ message: "Cannot delete user, Maybe user not found" })
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}

exports.listMatch = (req, res) =>{
    const user_id = req.params.id;
    const address_region = req.body.address_region;
    const sport_name = req.body.sport_name;
    const dateNow = new Date();

    MatchMaking.findAll({
        where: {
            finder_id: null,
            creator_id: {
                [Op.ne]: user_id
            },
            date_of_match: {
                [Op.gte]: dateNow
            },
            '$field.venue.address.address_region$': address_region,
            '$field.venue.sport.sport_name$': sport_name
        },
        include: [
            {
                model: db.fields,
                as: "field",
                include: [
                    {
                        model: db.venues,
                        as: "venue",
                        include: [
                            {
                                model: db.address,
                                as: "address"
                            },
                            {
                                model: db.sports,
                                as: "sport"
                            }
                        ]
                    }
                ]
            },
            {
                model: db.users,
                as: "creator"
            }
        ]
    })
    .then((matches) => {
        res.send(matches)
    })
    .catch(err => {
        res.status(500).send({
            message: "error while getting matches. Detail: " + err.message
        })
    });
}

exports.myMatch = (req, res) => {
    const id = req.params.id;
    return MatchMaking.findAll({
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
                        as: "venue",
                        include: [
                            {
                                model: db.address,
                                as: "address"
                            },
                            {
                                model: db.sports,
                                as: "sport"
                            }
                        ]
                    }
                ]
            },
            {
                model: db.users,
                as: "creator"
            },
            {
                model: db.users,
                as: "finder"
            }
        ]
    })
    .then((match) => {
        res.send(match)
    })
    .catch(err => {
        res.send({message: "Error while getting my match. DETAIL: " + err.message})
    })
}

exports.getMatchDetail = (req,res) => {
    const match_id = req.params.id;
    const dateNow = new Date();

    MatchMaking.findOne({
        where: {
            match_id: match_id
        },
            include: [
                {
                    model: db.fields,
                    as: "field",
                    include: [
                        {
                            model: db.venues,
                            as: "venue",
                            include: [
                                {
                                    model: db.address,
                                    as: "address"
                                },
                                {
                                    model: db.sports,
                                    as: "sport"
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.users,
                    as: "creator"
                },
                {
                    model: db.users,
                    as: "finder"
                },
                {
                    model: db.orders,
                    as: "order",
                    include: [
                        {
                            model: db.bills,
                            as: "bills",
                            include: [
                                {
                                    model: db.transactions,
                                    as: "transaction"
                                }
                            ]
                        }
                    ]
                }
            ]
        
    })
    .then( async (match) => {
        let tempDate = new Date(match.dataValues.date_of_match);
        let order;
        if(tempDate.getTime() < new Date()){
            order = await match.getOrder();
            order = order[0];
            order.update({order_status: "Invalid"});
        }
        res.send(match)
    } )
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })

}

