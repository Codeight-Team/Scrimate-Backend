module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define("address", {
        address_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
          address_street: {
            type: Sequelize.STRING
        },
        address_region: {
            type: Sequelize.STRING
        },
        address_city: {
            type: Sequelize.STRING
        },
        address_postalcode: {
            type: Sequelize.INTEGER
        },
        address_country: {
            type: Sequelize.STRING
        }
    });
  
    return Address;
  };