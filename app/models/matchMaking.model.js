module.exports = (sequelize, Sequelize) => {
    const MatchMaking = sequelize.define("matchMaking", {
        match_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        payment_distribution: {
            type: Sequelize.INTEGER,
        },
        date_of_match: {
            type: Sequelize.DATEONLY,
        },
        time_of_match: {
            type: Sequelize.TIME,
        }
    });


    return MatchMaking;
}