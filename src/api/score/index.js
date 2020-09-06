import Router from '@koa/router';

const score = new Router();

import scoreCtrl from './score.controller';

score.get('/search', scoreCtrl.search);

module.exports = score;