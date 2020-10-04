import Router from '@koa/router';

const account = new Router();

import accountCtrl from './account.controller';

account.get('/', accountCtrl.myaccount);
account.post('/change', accountCtrl.change);
account.get('/rank', accountCtrl.rank);
account.post('/searchuser', accountCtrl.searchuser);

module.exports = account;

