import Router from '@koa/router';

const score = new Router();

const scoreCtrl = require('./score.controller');



module.exports = score;