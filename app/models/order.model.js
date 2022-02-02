module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order",{
        order_id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        order_status: {
          type: Sequelize.STRING
        },
        date_of_match: {
          type: Sequelize.DATEONLY
        },
        time_of_match: {
          type: Sequelize.TIME
        }
    });

    return Order;

  };