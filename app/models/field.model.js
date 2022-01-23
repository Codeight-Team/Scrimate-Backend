module.exports = (sequelize, Sequelize) => {
    const Field = sequelize.define("field", {
        field_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        field_name: {
            type: Sequelize.STRING,
        },
        field_price : {
            type: Sequelize.INTEGER
        },
        field_type: {
            type: Sequelize.STRING
        }
    });

    return Field;
}