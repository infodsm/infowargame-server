import Koa  from 'koa';
import Router  from 'koa-router';
import logger  from 'koa-logger';
import koaBody  from 'koa-body';
import http  from 'http';

import api  from './api';

const app = new Koa();
const router = new Router();

app.use(logger());//http 메소드 로거 사용
app.use(koaBody());//json 형식 파싱용
app.use(router.routes()).use(router.allowedMethods());

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

let serverCallback = app.callback();
let httpServer = http.createServer(serverCallback);

httpServer.listen(4000, ()=>{console.log("success 4000")})