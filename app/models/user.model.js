module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        users_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
          first_name: {
            type: Sequelize.STRING
          },
          last_name: {
            type: Sequelize.STRING
          },
          email: {
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING
          },
          phone_number: {
            type: Sequelize.STRING
          },
          gender: {
            type: Sequelize.STRING
          },
          DOB: {
            type: Sequelize.DATE
          },
          image: {
            type: Sequelize.STRING
          }
    });
  
    return User;
  };