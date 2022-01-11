const jwt = require('jsonwebtoken');
const config = require("../config/auth.config");
const db = require("../models");
const User = db.users

const { TokenExpiredError } = jwt;

const catchTokenError = (err, res) => {
    if(err instanceof TokenExpiredError ){
        return res.status(401).send({
            message: "Access token was expired! you account status is Unauthorized"
        });
    }

    return res.sendStatus(401).send({ message: "Unauthorized" })
}

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            message: "No token provided"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return catchTokenError(err, res)
        }
        req.user_id = decoded.id;
        next();
    });

};

isAdmin = (req, res, next) => {
    User.findByPk(req.body.user_id).then(user => {
        user.getRole().then(roles => {
            for(let i=0;i < roles.length;i++){
                if(roles[i].name == "admin"){
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "require admin role"
            });
            return;
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};

module.exports = authJwt;