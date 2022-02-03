module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        transcation_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        transaction_time: {
            type: Sequelize.TIME
        }
    });

    return Transaction;
}