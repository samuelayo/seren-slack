const { Router } = require('express');
const { allAnswers, specificUserAnswers } = require('../controllers/answersController');

const messageRouter = new Router();

messageRouter.post('/all', allAnswers);
messageRouter.post('/user/:userId', specificUserAnswers);

module.exports = messageRouter;
