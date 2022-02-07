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

    

    Operational.createOperationalHour = (req, res) => {
        const id = req.params.id;

        for(let i = 0;i<req.body.length; i++){
            Operational.create({
                operational_day: req.body[i].operational_day,
                operational_timeOpen: req.body[i].operational_timeOpen,
                operational_timeClose: req.body[i].operational_timeClose,
                venue_id: id
            });
        }
        res.send({message: "Hour Created"});
    }

    return Operational;
}