module.exports = app =>{
    const messagerController = require("../controllers/messager.controller");

    var router = require("express").Router();

    //conversation
    router.post('/create-conversation', messagerController.createConversation);
    router.get('get-conversation/:id', messagerController.getConversation);

    //Message
    router.post('/add-message', messagerController.addMessage);
    router.get('/get-massage/:id', messagerController.getMessage)

    app.use('/api/messager', router);

}