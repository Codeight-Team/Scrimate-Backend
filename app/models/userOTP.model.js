module.exports = (sequelize, Sequelize) => {
    const UserOTP = sequelize.define("userOTP", {
        userOTP_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        otp: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.DATE,
        }
    });

    return UserOTP;
};