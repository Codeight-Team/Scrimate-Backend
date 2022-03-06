const db = require("../models");
const ROLES = db.ROLES;
const User = db.users;

checkIfEmailIsDuplicate = (req, res, next) => {
    //Email

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Email already in used"
            });
            return;
        }
        next();
    });

};

checkRolesExisted = (req, res, next) => {
    if (req.body.role) {
        for (let i = 0; i < req.body.role.length; i++) {
            if (!ROLES.includes(req.body.role[i])) {
                res.status(400).send({
                    message: "Role (" + req.body.role + ") does not exist"
                });
                return;
            }
        }
    }
    next();
};

const verifySignup = {
    checkIfEmailIsDuplicate: checkIfEmailIsDuplicate,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignup;