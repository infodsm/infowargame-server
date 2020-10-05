import Router from '@koa/router';

const api = new Router();


import admin from './admin';
import auth from './auth';
import challenge from './challenge';
import account from './account';


api.use('/admin', admin.routes());
api.use('/auth', auth.routes());
api.use('/challenge', challenge.routes());
api.use('/account', account.routes());


module.exports = api;