import Router from '@koa/router';

const auth = new Router();

import authCtrl from './auth.controller';

auth.post('/login', authCtrl.login);
auth.post('/signup', authCtrl.signup);
auth.get('/idcheck', authCtrl.idcheck);
auth.post('/emailsend', authCtrl.emailsend);
auth.get('/emailcheck', authCtrl.emailcheck);
auth.get('/mypage', authCtrl.mypage);
auth.post('/changemyinfo', authCtrl.changemyinfo);
auth.post('/findpassword', authCtrl.findpassword);

module.exports = auth;