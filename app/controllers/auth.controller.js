const db = require("../models");
const config = require("../config/auth.config");
const { users: User, roles: Role, refreshToken: RefreshToken, usersOTP: UserOTP } = db;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "firhanreynaldi@gmail.com",
        pass: "Telkomsel123"
    }
});

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
        image: "images/profile-picture/default.png",
        isVerif: false,
        address_id: address_id
    })
        .then(user => {
            if (req.body.role) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.role
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

            let isRefreshTokenExist = await RefreshToken.findOne({
                where: {
                    user_id: {
                        [Op.eq]: user.user_id
                    }
                }
            }).then(async refreshTokenData => {
                var token; let refreshToken;
                if (refreshTokenData) {
                    token = refreshTokenData.access_token;
                    refreshToken = refreshTokenData.token;
                    if(RefreshToken.verifyExpiration(refreshTokenData)){
                        RefreshToken.update({expiryDate: new Date() + config.jwtRefreshExpiration},{
                            where: {
                                user_id: refreshTokenData.user_id
                            }
                        });
                    }
                    jwt.verify(token, config.secret, (err)=> {
                        if (err){
                            token = jwt.sign({ id: user.user_id }, config.secret, {
                                expiresIn: config.jwtExpiration
                            });
                        }
                    })
                }else{
                    token = jwt.sign({ id: user.user_id }, config.secret, {
                        expiresIn: config.jwtExpiration
                    });
        
                    refreshToken = await RefreshToken.CreateToken(user, token);
                }
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
            });
        }).catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh token is required" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        console.log(refreshToken);

        if (!refreshToken) {
            res.status(403).json({ message: "Require refresh token in database" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Expired refresh token. Please re-sign"
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ user_id: user.user_id }, config.secret, {
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

exports.sendOTPVerif = async (user_id, email, res) => {
    

    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

    const emailInfo = {
        from: "firhanreynaldi@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `<p>Verification Code: <b>${OTP}</b>. Enter the code in the app to verify your account</p> <p> This Code <b>expires in 1 hour</b>, Please verify immediately! </p>`
    }

    const hashedOTP = await bcrypt.hash(OTP, 10);
    const userotp = {
        user_id: user_id,
        otp: hashedOTP,
        expiryDate:  Date.now() + 3600000
    }
    await UserOTP.create(userotp)
    .then(async (result) => {
        await transporter.sendMail(emailInfo);
        res.send({
            status: "Sent",
            message: "Verification has been sent to " + email + ".",
            expire: result.expiryDate
        })
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    });
}

exports.verifyAccount = (req,res) => {
    const user_id = req.params.id;
    const OTP = req.body.otp;

    if(!user_id || !OTP){
        res.status(500).send({ message: "Detail cannot empty" })
    }else{
        UserOTP.findOne({
            where: {
                user_id: user_id
            }
        })
        .then((result) => {
            if(!result){
                res.status(404).send({
                    message: "Cannot find account with that id."
                })
            }else{
                const expiryDate = result.expiryDate;
                const otp = result.otp;

                if(expiryDate.getTime() < new Date()){
                    UserOTP.destroy({
                        where: {
                            user_id: user_id
                        }
                    })
                    .then(() => {
                        res.send({ message: "Code has been expire, Please request a new code" })
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message })
                    })
                }else{
                    const ifValid = bcrypt.compare(OTP.toString(), otp)

                    if(!ifValid){
                        res.send(401).send({ message: "Invalid code"});
                    }else{
                        User.update({isVerif: true}, {
                            where: {
                                user_id: user_id
                            }
                        })
                        .then(() => {
                            UserOTP.destroy({
                                where: {
                                    user_id: user_id
                                }
                            })
                            res.send({ message: "Account has been verified successfully" })
                        })
                        .catch(err => {
                            res.status(500).send({ message: err.message })
                        });
                    }
                }

            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
    }
}

exports.resendOTP = (req,res) => {
    const user_id = req.params.id;
    const email = req.body.email;

    if(!user_id || !email){
        res.send(500).send({ message: "Details cannot be empty" })
    }else{
        UserOTP.destroy({
            where: {
                user_id: user_id
            }
        })
        //Send otp in route
    }

}

exports.sendRandomPasswordtoEmail = (req,res) =>  {
    const email = req.body.email;

    const password = (Math.random() + 1).toString(36).substring(2);
    const emailInfo = {
        from: "firhanreynaldi@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `<p>Your Password: <b>${password}</b>.</p> <p> Please <b>Memorize</b> your password. </p>`
    }

    User.findOne({
        where: {
            email: email
        }
    })
    .then(async (result) => {
        if(!result){
            res.status(404).send({
                message: "Account doesnt exist"
            })
        }else{
            var hashedPass = bcrypt.hashSync(password, 10);
            await result.update({ password: hashedPass })
            await transporter.sendMail(emailInfo)
            res.send({
                status: "Sent",
                message: "New password has been sent to " + email + ".",
            })
        }
    })
}