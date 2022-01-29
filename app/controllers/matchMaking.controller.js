const db = require("../models");
const MatchMaking = db.matchMaking;
const Op = db.Sequelize.Op;

exports.createMatch = (creator_id, field_id, req, res) => {
    const matchMaking = {
        payemnt_distribution: req.body.payemnt_distribution,
        date_of_match: req.body.date_of_match,
        creator_id: creator_id,
        field_id: field_id
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
    const finder = {
        finder_id: req.body.user_id
    }

    MatchMaking.update(finder, {
        where: {
            match_id: id
        }
    })
    .then( () => {
        res.send({
            message: "Success join the match"
        })
    })
    .catch(err => {
        res.status(500).send({
            message: "Failed to join a match: " + err.message
        })
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
    return MatchMaking.findAll({
        where: {
            finder_id: null
        }
    })
    .then(match => {
        return match;
    });
}

exports.myMatch = (req, res) => {
    const id = req.params.id;
    return MatchMaking.findAll({
        where: {
            [Op.or]: [{creator_id: id}, {finder_id: id}]
        }
    })
    .then(match => {
        return match; 
    })
}

