import Router from '@koa/router';
import multer from '@koa/multer';

const admin = new Router();

import adminCtrl from './admin.controller';
const upload = multer({ dest: './files/' }); // note you can pass `multer` options here

admin.post('/login', adminCtrl.login);
admin.post('/signup', adminCtrl.signup);
admin.post('/challenge/make', adminCtrl.challengemake);
admin.delete('/challenge/:quiz_num', adminCtrl.challengedelete);
admin.post('/file', upload.single('filetoadd'),adminCtrl.fileadd);
admin.delete('/file/:quiz_num', adminCtrl.filedelete);



module.exports = admin;