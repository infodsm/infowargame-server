import Router from '@koa/router';
import multer from '@koa/multer';

const admin = new Router();

const adminCtrl = require('./admin.controller');
const upload = multer({ dest: './files/' }); // note you can pass `multer` options here

admin.post('/login', adminCtrl.login);
admin.post('/signup', adminCtrl.signup);
admin.post('/quizmake', adminCtrl.quizmake);
admin.post('/quizdelete', adminCtrl.quizdelete);
admin.post('/fileadd', upload.single('filetoadd'),adminCtrl.fileadd);
admin.post('/filedelete', adminCtrl.filedelete);

module.exports = admin;