import Router from '@koa/router';

const quiz = new Router();

const quizCtrl = require('./quiz.controller');

quiz.get('/loadpage', quizCtrl.loadpage);
quiz.get('/loadquiz', quizCtrl.loadquiz);
quiz.post('/download', quizCtrl.download);
quiz.get('/answer', quizCtrl.answer);
quiz.get('/quiz', quizCtrl.quiz);


module.exports = quiz;