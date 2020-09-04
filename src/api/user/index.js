import Router from '@koa/router';

const user = new Router();

import userCtrl from './user.controller';

user.get('/search', userCtrl.search);

module.exports = user;