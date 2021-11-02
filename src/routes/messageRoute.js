const { Router } = require('express');
const { verifyMessage, processMessage } = require('../controllers/messageController');

const messageRouter = new Router();

messageRouter.post('/', verifyMessage, processMessage);

module.exports = messageRouter;
