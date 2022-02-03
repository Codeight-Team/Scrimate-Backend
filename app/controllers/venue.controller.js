const db = require("../models");
const Venue = db.venues;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');

exports.createVenue = (sport_id, address_id, req, res) => {
    const id = req.params.id;
    let image_path;
    if(req.file){
        image_path = req.file.path.substr(11);
        image_path = image_path.replace(/\s+/g, '_');
    }    
    const venue = {
        venue_name: req.body.venue_name,
        venue_facility: req.body.venue_facility,
        venue_description: req.body.venue_description,
        image: image_path,
        isOpen: true,  //jangan lupa ganti false
        sport_id: sport_id,
        address_id: address_id,
        user_id: id
    };

    return Venue.create(venue)
        .then(venues => {
            res.send("Venue Created");
        })
        .catch(err => {
            res.status(500).send({ message: err.message + "Venue" });
        });
}

exports.findIdByName = (req) => {
    var venue_name = req.body.venue_name;

    return Venue.findOne({ where: { venue_name: venue_name } })
        .then(name => {
            return name.venue_id;
        });

}

exports.getVenueBySportAndRegion = (req) => {
    var sport_name = req.body.sport_name;
    var address_region = req.body.address_region;

    return Venue.findAll({
        where: {
            isOpen: true
        },
        attributes: {
            include:
                [
                    [db.sequelize.literal(`(
                            SELECT ROUND(AVG(rating_num)) as average
                            FROM ratings
                            WHERE ratings.venue_id = venue.venue_id
                        )`), 'Average']
                ],
        },
        include: [
            {
                model: db.address,
                as: 'address',
                where: {
                    address_region: address_region
                }
            },
            {
                model: db.sports,
                as: 'sport',
                where: {
                    sport_name: sport_name
                }
            },


        ],
    });

}

exports.venueDetail = () => {
    const id = req.params.id;

    Venue.findOne({
        where: {
            venue_id: id
        },
        attributes: {
            include:
                [
                    [db.sequelize.literal(`(
                            SELECT ROUND(AVG(rating_num)) as average
                            FROM ratings
                            WHERE ratings.venue_id = venue.venue_id
                        )`), 'Average']
                ],
        },
        include: [
            {
                model: db.operationals
            },
            {
                model: db.address
            },
            {
                model: db.ratings,
                as: 'venue_rating',
            }
        ]
    })
    .then( (venues) => {
        res.send(venues)
    } )
    .catch(err => {
        res.status(500).send({ message: err.message + "Venue" });
    });

}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/assets/images/venues')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + req.body.venue_name.replace(/\s+/g, '_') + path.extname(file.originalname))
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

exports.delete = async (req, res) => {
    const id = req.params.id;

    const venue =  await Venue.findOne({
        where:{
            venue_id: id
        },
    })
    .then( (result) => {
        if(!result){
            res.status(500).send({ message: "Venue not found" })
        }
        return result;
    } );

    await venue.destroy()
    .then(() => {
        res.send({ message: "Delete Success" })
    })
    .catch(err => {
        res.status(500).send({
            message: "Error when delete venue: " + err.message
        })
    });
}

exports.getMyVenue = (req, res) => {
    const id = req.params.id;

    return Venue.findAll({
        where: {
            user_id: id
        },
        include: [
            {
                model: db.address
            },
            {
                model: db.fields,
                as: "field"
            }
        ]
    })
    .then( num => {
        if(!num){
            res.status(404).send({
                message: "This user doesnt have any venue"
            })
        }else{
            res.send(num)
        }
    } )
    .catch(err => {
        res.status(500).send({ message: "error while getting venue: " + err.message })
    })
}
