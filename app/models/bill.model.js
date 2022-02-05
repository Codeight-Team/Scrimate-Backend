module.exports = (sequelize, Sequelize) => {
    const Bill = sequelize.define("bill", {
        bill_id: {
            type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        bill_amount: {
            type: Sequelize.INTEGER
        },
        bill_va_num: {
            type: Sequelize.STRING
        },
        bill_status: {
            type: Sequelize.STRING
        }
    })

    return Bill;
}