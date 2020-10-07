import Router from '@koa/router';

const challenge = new Router();

import challengeCtrl from './challenge.controller';

challenge.get('/page', challengeCtrl.loadpage);
challenge.get('/:quiz_code', challengeCtrl.loadquiz);
challenge.get('/download/:quiz_code', challengeCtrl.download);
challenge.post('/answer/:quiz_code', challengeCtrl.answer);
challenge.get('/', challengeCtrl.quiz);


module.exports = challenge;