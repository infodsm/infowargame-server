import crypto from 'crypto';//암호화 모듈
import mariadb from 'mariadb';//mariadb 사용 모듈
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config()

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//로그인 api
exports.login = (async (ctx,next) => {
  const id = ctx.request.body.id;
  const password = ctx.request.body.password;
});

// api
exports.signup = (async (ctx,next) => {
});

// api
exports.idcheck = (async (ctx,next) => {
});

// api
exports.emailsend = (async (ctx,next) => {
});

// api
exports.emailcheck = (async (ctx,next) => {
});

// api
exports.mypage = (async (ctx,next) => {
});

// api
exports.change = (async (ctx,next) => {
});

// api
exports.findpassword = (async (ctx,next) => {
});