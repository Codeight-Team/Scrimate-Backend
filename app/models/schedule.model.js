module.exports = (sequelize, Sequelize) => {
    const Schedule = sequelize.define("schedule", {
        schedule_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        schedule_date: {
            type: Sequelize.DATE
        },
        schedule_time: {
            type: Sequelize.TIME
        },
        generate: {
            type: Sequelize.STRING
        }
    });
    
    return Schedule;
}