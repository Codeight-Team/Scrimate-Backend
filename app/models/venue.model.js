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
        venue_type: {
            type: Sequelize.STRING
        },
        venue_contact: {
            type: Sequelize.STRING
        },
        images: {
            type: Sequelize.STRING
        }
    });

    return Venue;
};