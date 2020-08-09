const Router = require('koa-router');

const user = new Router();

const userCtrl = require('./user.controller');



module.exports = user;