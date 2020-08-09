import Router from 'koa-router';

const api = new Router();


import admin from './admin';
import auth from './auth';
import quiz from './quiz';
import score from './score';
import user from './user';


api.use('/admin', admin.routes());
api.use('/auth', auth.routes());
api.use('/quiz', quiz.routes());
api.use('/score', score.routes());
api.use('/user', user.routes());


module.exports = api;