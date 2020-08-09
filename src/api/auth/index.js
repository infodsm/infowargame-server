const Router = require('koa-router');

const auth = new Router();

const authCtrl = require('./auth.controller');



module.exports = auth;