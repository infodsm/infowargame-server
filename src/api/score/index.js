import Router from '@koa/router';

const score = new Router();

import scoreCtrl from './score.controller';

score.get('/load', scoreCtrl.load);

module.exports = score;