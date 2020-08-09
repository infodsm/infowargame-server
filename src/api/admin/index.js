const Router = require('koa-router');

const admin = new Router();

const adminCtrl = require('./admin.controller');



module.exports = admin;