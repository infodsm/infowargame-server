import Router from '@koa/router';

const quiz = new Router();

import quizCtrl from './quiz.controller';

quiz.get('/loadpage', quizCtrl.loadpage);
quiz.get('/loadquiz', quizCtrl.loadquiz);
quiz.get('/download', quizCtrl.download);
quiz.get('/answer', quizCtrl.answer);
quiz.get('/quiz', quizCtrl.quiz);


module.exports = quiz;