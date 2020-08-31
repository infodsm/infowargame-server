import Router from '@koa/router';

const user = new Router();

const userCtrl = require('./user.controller');

user.get('/search', userCtrl.search);

module.exports = user;