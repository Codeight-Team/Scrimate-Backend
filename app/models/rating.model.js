module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define("rating", {
        rating_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rating_num: {
            type: Sequelize.INTEGER
        },
        rating_comment: {
            type: Sequelize.STRING
        }
    })

    return Rating;
}