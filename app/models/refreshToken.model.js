const config = require("../config/auth.config");
const {v4: uuidv4} = require("uuid");

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        token: {
            type: Sequelize.STRING,
        },
        expiryDate: {
            type: Sequelize.DATE,
        }
    });

    RefreshToken.CreateToken = async function (user) {
        let expire = new Date();

        expire.setSeconds(expire.getSeconds() + config.jwtRefreshExpiration);

        let tempToken = uuidv4();

        let refreshToken = await this.create({
            token: tempToken,
            user_id : user.user_id,
            expiryDate: expire.getTime()
        });

        return refreshToken.token;

    };

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    return RefreshToken;

}