const db = require("../models");
const Conversation = db.conversations;
const Message = db.messages;


//Create Conversation
exports.createConversation = (req, res) => {
    const id = req.params.id;
    const conversation = new Conversation({
        match_id: id,
        members: [req.body.creator_id, req.body.finder_id],
    });

    conversation
    .save(conversation)
    .then( () => {
        res.send({ message: "Conversation Created" })
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}

//Get conversation
exports.getConversation = (req, res) => {
    const id = req.params.id;

    Conversation.find({
        members: {$in: [id]}
    })
    .then(conv => {
        if(conv.length != 0){
            res.send(conv)
        }else{
            res.status(404).send({ message: "Conversation not found" })
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    });
    
}

//New Message
exports.addMessage = (req, res) => {
    const newMessage = new Message(req.body);

    newMessage
    .save(newMessage)
    .then( msg => {
        res.send(newMessage)
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
}

//get Message
exports.getMessage = (req, res) => {
    const id = req.params.id;

    Message.find({
        conversation_id: id
    })
    .then(data => {
        if(data.length != 0){
            res.send(data)
        }else{
            res.status(404).send({ message: "Message conversation not found with id = " + id })
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
}
