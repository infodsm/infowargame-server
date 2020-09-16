import crypto from 'crypto';//암호화 모듈
import mariadb from 'mariadb';//mariadb 사용 모듈

import jwt from './../../lib/token.js';
import mail from './../../lib/mail.js';
import log from './../../lib/log.js';
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});




//로그인 api 0
exports.login = (async (ctx,next) => {
  const id = ctx.request.body.id;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const login = async() => {
    sql = `SELECT * FROM admin WHERE id = '${id}' AND password = '${password}';`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      token = await jwt.jwtsign(id);
      await log.setlog(`어드민 로그인`,id,`${id}님이 로그인하셨습니다.`);
      check = true;
    }   
  };

  await login();
  ctx.status = 201;
  ctx.body = {check,token};
});

//회원가입 api 0
exports.signup = (async (ctx,next) => {
  const id = ctx.request.body.id;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  const nickname = ctx.request.body.nickname;
  const code = ctx.request.body.code;
  let check = false;
  let sql,rows;

  const signup = async() => {
    sql = `SELECT id FROM admin WHERE id = '${id}';`;
    rows = await connection.query(sql);

    if(rows[0] == undefined && process.env.admincode == code){
      sql = `INSERT INTO admin(id,password,name) values('${id}','${password}','${nickname}');`;
      await connection.query(sql);
      await log.setlog(`어드민 회원가입`,id,`${id}님이 가입하셨습니다.`);
      check = true;
    }
  };

  await signup();
  ctx.status = 201;
  ctx.body = {check};
});

//문제 만들기 api 
exports.quizmake =  (async (ctx,next) => {
  const id = ctx.request.body.id;
  const quizname = ctx.request.body.quizname;
  const contents = ctx.request.body.contents;
  const category = ctx.request.body.category;
  const point = ctx.request.body.point;
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const quizmake = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql);

    if(id == await jwt.jwtverify(token) && rows[0] == undefined){
      sql = `INSERT quiz(category,makeid,name,content,point) VALUE(${category},'${id}','${quizname}','${contents}',${point});`;
      rows = await connection.query(sql);
      await log.setlog(`문제 만들기`,id,`${id}님이 ${quizname}문제를 만들었습니다.`);
      check = true;
    }
  };

  await quizmake();
  ctx.status = 201;
  ctx.body = {check};
});

//문제 삭제 api 
exports.quizdelete = (async (ctx,next) => {
  const quizname = ctx.request.body.quizname;
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const quizdelete = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql);
    token = await jwt.jwtverify(token);

    if(token != '' && rows[0] != undefined){
      sql = `DELETE FROM quiz WHERE makeid = '${token}' AND name = '${quizname}';`;
      rows = await connection.query(sql);
      await log.setlog(`문제 만들기`,token,`${token}님이 ${quizname}문제를 삭제했습니다.`);
      check = true;
    }
  };

  await quizdelete();
  ctx.status = 201;
  ctx.body = {check};
});

//문제 파일 추가 api 
exports.fileadd =  (async (ctx,next) => {
  const quizname = ctx.request.body.quizname;
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const fileadd = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql);
    token = await jwt.jwtverify(token);

    /*console.log('ctx.request.file', ctx.request.file);
    console.log('ctx.file', ctx.file);
    console.log('ctx.request.body', ctx.request.body);*/

    if(token != '' && rows[0] != undefined){
      sql = `UPDATE quiz SET file = '${ctx.request.file.filename}' WHERE makeid = '${token}' AND name = '${quizname}';`;
      rows = await connection.query(sql);
      await log.setlog(`문제 파일추가`,token,`${token}님이 ${quizname}문제에 파일을 추가했습니다.`);
      check = true;
    }
  };

  await fileadd();
  ctx.status = 201;
  ctx.body = {check};
});

//문제 파일 삭제 api 
exports.filedelete = (async (ctx,next) => {
  const quizname = ctx.request.body.quizname;
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const filedelete = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql);
    token = await jwt.jwtverify(token);

    if(token != '' && rows[0] != undefined){
      sql = `UPDATE quiz SET file = NULL WHERE makeid = '${token}' AND name = '${quizname}';`;
      rows = await connection.query(sql);
      await log.setlog(`문제 파일삭제`,token,`${token}님이 ${quizname}문제의 파일을 삭제했습니다.`);
      check = true;
    }
  };

  await filedelete();
  ctx.status = 201;
  ctx.body = {check};
});