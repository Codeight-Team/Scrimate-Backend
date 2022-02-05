const db = require("../models");
const Field = db.fields;
const Schedule = db.schedules;
const Order = db.orders;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');

exports.createField = ( req, res) => {
    const id = req.params.id;
    let image_path;
    if(req.file){
        image_path = req.file.path.substr(11);
        image_path = image_path.replace(/\s+/g, '_');
    }
    const field = {
        field_name: req.body.field_name,
        field_price: req.body.field_price,
        field_type: req.body.field_type,
        image: image_path,
        venue_id: id,
    }

    return Field.create(field)
    .then(() => {
        res.send({ message: "Field Created"});
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    });
}

exports.getFields = (req, res) => {
    if(!req.params.id){
        return res.status(500).send({
            message: "Require venue ID for get fields"
        })
    }
    const id = req.params.id

    return Field.findAll({
        where: {
            venue_id: id
        }
    })
    .then((fields)=>{
        res.send(fields)
    })
    .catch(err=> {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.getFieldSchedule = async(req, res) => {
    if(!req.params.id){
        return res.status(500).send({
            message: "Require field ID for get field schedule"
        })
    }
    const id = req.params.id
    const date_choose = req.body.date_choose;

    const times = [];
    
    Schedule.findAll({
        raw: true,
        where: {
            '$field.field_id$': id,
            schedule_date: date_choose
        },
        attributes: [
            'schedule_time'
        ],
        include: [
            {
                model:db.fields,
                as: "field",
                attributes: []
            }
        ]
    })
    .then((schedules) => {
        if(schedules!=null){
            for(let i = 0 ; i < schedules.length ; i++){
                times.push(schedules.schedule_time)
            }
        }
    })

    Order.findAll({
        raw: true,
        where: {
            [Op.and]:
            [
                {date_of_match: date_choose},
                {
                    [Op.or]:
                    [
                        {'$bills.bill_status$': "pending"},
                        {'$bills.bill_status$': "settlement"},
                    ]
                }
            ]
        },
        attributes: [
            'time_of_match'
        ],
        include: [
            {
                model: db.bills,
                as: "bills"
            }
        ]
    })
    .then((result) => {
        if(result!=0){
            for(let i = 0; i< result.length; i++){
                times.push(result.time_of_match)
            }
        }
    })

    res.send({times})
    
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/assets/images/fields')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + req.body.field_name.replace(/\s+/g, '_') + path.extname(file.originalname))
    }
})

exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper file formate')
    }
}).single('image')