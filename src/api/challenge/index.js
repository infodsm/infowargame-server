import Router from '@koa/router';

const challenge = new Router();

import challengeCtrl from './challenge.controller';

challenge.get('/loadpage', challengeCtrl.loadpage);
challenge.get('/loadquiz', challengeCtrl.loadquiz);
challenge.get('/download', challengeCtrl.download);
challenge.get('/answer/:quiz_code', challengeCtrl.answer);
challenge.get('/:id', challengeCtrl.quiz);


module.exports = challenge;