import crypto from 'crypto';//암호화 모듈
import mariadb from 'mariadb';//mariadb 사용 모듈
import model from './../../db/model/index.js';
import db from './../../db/index.js';
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

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

//회원가입 api 0
exports.signup = (async (ctx,next) => {
  const id = ctx.request.body.id;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  const nickname = ctx.request.body.nickname;
  const email = ctx.request.body.email;
  const team = ctx.request.body.team;
  let check = false;
  let sql;
  let rows;

  const signup = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);

    if(rows[0] == undefined){
      sql = `INSERT INTO user(name,id,password,team,email,score) values('${nickname}','${id}','${password}','${team}','${email}',0);`;
      rows = await connection.query(sql);
      check = true;
    }
  };

  await signup();
  ctx.status = 201;
  ctx.body = {check : check};
});

//아이디 중복체크 api
exports.idcheck = (async (ctx,next) => {
  const id = ctx.query.userid;
  let check = false;
  let sql;
  let rows;

  const idcheck = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);
    
    if(rows[0] == undefined){ check = true; }
  };

  await idcheck();
  ctx.status = 200;
  ctx.body = {check : check};
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