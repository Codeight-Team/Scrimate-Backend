module.exports = (sequelize, Sequelize) => {
    const Venue = sequelize.define("venue", {
        venue_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        venue_name: {
            type: Sequelize.STRING
        },
        venue_facility: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        venue_description: {
            type: Sequelize.STRING
        },
        images: {
            type: Sequelize.STRING
        },
        isOpen: {
            type: Sequelize.BOOLEAN
        }
    });

    return Venue;
};