const db = require("../models");
const Field = db.fields;
const Schedule = db.schedules;
const Op = db.Sequelize.Op;

exports.createField = ( req, res) => {
    const id = req.params.id;
    let image_path;
    if(req.file){
        image_path = req.file.path.substr(11);
    }
    const field = {
        field_name: req.body.field_name,
        field_price: req.body.field_name,
        field_type: req.body.field_name,
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
            venue_id = id
        }
    })
}

exports.getFieldSchedule = (req, res) => {
    if(!req.params.id){
        return res.status(500).send({
            message: "Require field ID for get field schedule"
        })
    }
    const id = req.params.id
    const date_choose = req.body.date_choose;
    
    Field.findOne({
        where: {
            field_id = id
        },
        attribute: [],
        include: {
            model: db.schedules,
            where: {
                schdule_date = date_choose
            }
        }
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/assets/images/fields')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + req.body.field_name + path.extname(file.originalname))
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