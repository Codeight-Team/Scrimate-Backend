module.exports = (sequelize, Sequelize) => {
    const MatchForum = sequelize.define("matchForum", {
        forum_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
    })
}