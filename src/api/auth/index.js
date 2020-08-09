const Router = require('koa-router');

const auth = new Router();

const authCtrl = require('./auth.controller');

auth.post('/login', authCtrl.login);
auth.post('/signup', authCtrl.signup);
auth.get('/idcheck', authCtrl.idcheck);
auth.post('/emailsend', authCtrl.emailsend);
auth.get('/emailcheck', authCtrl.emailcheck);
auth.get('/mypage', authCtrl.mypage);
auth.post('/change', authCtrl.change);
auth.get('/findpassword', authCtrl.findpassword);

module.exports = auth;