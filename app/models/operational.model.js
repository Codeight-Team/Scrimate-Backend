module.exports = (sequelize, Sequelize) => {
    const Operational = sequelize.define("operational", {
        operational_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        operational_day: {
            type: Sequelize.INTEGER
        },
        operational_timeOpen: {
            type: Sequelize.TIME
        },
        operational_timeClose: {
            type: Sequelize.TIME
        }
    });

    

    Operational.createOperationalHour = (venue_id ,req) => {

        for(let i = 0;i<req.body.operational_day.length; i++){
            Operational.create({
                operational_day: req.body.operational_day[i],
                operational_timeOpen: req.body.operational_timeOpen[i],
                operational_timeClose: req.body.operational_timeClose[i],
                venue_id: venue_id
            });
        }
    }

    return Operational;
}