module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
        report_reason: {
            type: Sequelize.STRING
        }
    })

    return Report;
}