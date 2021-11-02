const { Router } = require('express');
const { processInteraction } = require('../controllers/interactiveController');
const { verifyRequest } = require('../utils/verifyRequest');

const messageRouter = new Router();

messageRouter.post('/', verifyRequest, processInteraction);

module.exports = messageRouter;
