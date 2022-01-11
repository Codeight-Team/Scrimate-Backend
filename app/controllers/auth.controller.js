const db = require("../models");
const config = require("../config/auth.config");
const { users: User, roles: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Regist User
exports.createUser = (address_id, req, res) => {

    var hashedPass = bcrypt.hashSync(req.body.password, 10);
    return User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPass,
        phone_number: req.body.phone_number,
        gender: req.body.gender,
        DOB: req.body.DOB,
        image: req.body.image,
        address_id: address_id
    })
        .then(user => {
            if (req.body.role) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.eq]: req.body.role
                        }
                    }
                }).then(role => {
                    user.setRole(role).then(() => {
                        res.send({ message: "User was registered" })
                    });
                })
            } else {
                Role.findAll({
                    where: {
                        name: {
                            [Op.eq]: "user"
                        }
                    }
                }).then(role => {
                    user.setRole(role).then(() => {
                        res.send({ message: "User was registered" })
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
};

//Login User
exports.findOne = async (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email } })
        .then(async user => {
            if (!user) {
                return res.status(404).send({ message: "Invalid email or password" })
            }

            var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid email or password"
                })
            }

            var token = jwt.sign({ id: user.user_id }, config.secret, {
                expiresIn: config.jwtExpiration
            });

            let refreshToken = await RefreshToken.CreateToken(user);

            var authorities = [];

            user.getRole().then(role => {
                for (let i = 0; i < role.length; i++) {
                    authorities.push("ROLE_" + role[i].name.toUpperCase());
                }
                res.status(200).send({
                    user_id: user.user_id,
                    email: user.email,
                    role: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                })
            })

        }).catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if(requestToken == null) {
        return res.status(403).json({ message: "Refresh token is required" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: {token: requestToken} });

        console.log(refreshToken);

        if(!refreshToken){
            res.status(403).json({ message: "Require refresh token in database" });
            return;
        }

        if(RefreshToken.verifyExpiration(refreshToken)){
            RefreshToken.destroy({ where: {id: refreshToken.id} });

            res.status(403).json({
                message: "Expired refresh token. Please re-sign"
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({user_id: user.user_id}, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        })

    } catch (err) {
        res.status(500).send({ message: err });
    }

}