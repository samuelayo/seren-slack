const { Router } = require('express');
const { processMessage } = require('../controllers/messageController');
const { verifyRequest } = require('../utils/verifyRequest');

const messageRouter = new Router();

messageRouter.post('/', verifyRequest, processMessage);

module.exports = messageRouter;
