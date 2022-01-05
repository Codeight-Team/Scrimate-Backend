module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order",{
        order_id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        order_type: {
          type: Sequelize.STRING
        }  
    });

    return Order;

  };