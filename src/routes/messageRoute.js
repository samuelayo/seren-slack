const { Router } = require('express');
const { processMessage } = require('../controllers/messageController');

const messageRouter = new Router();

messageRouter.post('/', processMessage);

module.exports = messageRouter;
