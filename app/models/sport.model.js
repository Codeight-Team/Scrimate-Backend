module.exports = (sequelize, Sequelize) => {
    const Sport = sequelize.define("sport", {
        sport_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
        sport_name: {
          type: Sequelize.STRING
        },
        player_number: {
          type: Sequelize.INTEGER
        }
    });
  
    return Sport;
  };