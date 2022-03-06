module.exports = (sequelize, Sequelize) => {
    const Refund = sequelize.define("refund", {
        refund_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        refund_reason: {
            type: Sequelize.STRING
        }
    });

    return Refund;
};