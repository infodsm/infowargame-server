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




//로그인 api O
exports.login = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  let sql,rows,token,status,body;

  const login = async() => {
    sql = `SELECT * FROM admin WHERE id = '${id}' AND password = '${password}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    if(rows[0] != undefined){ 
      token = await jwt.jwtsign(id);
      await log.setlog(`어드민 로그인`,id,`${id}님이 로그인하셨습니다.`);
      
      status = 201;
      body = {"token" : token};
    }else{
      await log.setlog(`어드민 로그인 실패`,id,`${id}님이 로그인 실패하셨습니다.`);

      status = 403;
      body = {"message" : "your id or password id wrong"};
    }
  };

  await login();
  ctx.status = status;
  ctx.body = body;
});

//회원가입 api O
exports.signup = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  const { nickname } = ctx.request.body;
  const { code } = ctx.request.body;
  let sql,rows,status,body;

  const signup = async() => {
    sql = `SELECT id FROM admin WHERE id = '${id}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    if(rows[0] == undefined && process.env.admincode == code){
      sql = `INSERT INTO admin(id,password,name) values('${id}','${password}','${nickname}');`;
      await connection.query(sql,() =>{connection.release();});
      await log.setlog(`어드민 회원가입`,id,`${id}님이 가입하셨습니다.`);
      
      status = 201;
      body = {};
    }else{
      await log.setlog(`어드민 회원가입 실패`,id,`${id}님이 가입 실패하셨습니다.`);

      status = 403;
      body = {"message" : "your id or password or code is wrong"};
    }
  };

  await signup();
  ctx.status = status;
  ctx.body = body;
});

//문제 만들기 api O
exports.challengemake =  (async (ctx,next) => {
  const { category } = ctx.request.body;
  const { contents } = ctx.request.body;
  const { point } = ctx.request.body;
  const { quizname } = ctx.request.body;
  const { flag } = ctx.request.body;
  let { authentication } = ctx.request.header;
  let sql,rows,status,body;

  const challengemake = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    authentication = await jwt.jwtverify(authentication);

    if(authentication != '' && rows[0] == undefined){
      sql = `INSERT quiz(category,makeid,name,content,point,flag) VALUE(${category},'${authentication}','${quizname}','${contents}',${point},'${flag}');`;
      await connection.query(sql,() =>{connection.release();});

      await log.setlog(`문제 만들기`,authentication,`${authentication}님이 ${quizname}문제를 만들었습니다.`);
      
      status = 201;
      body = {};
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await challengemake();
  ctx.status = status;
  ctx.body = body;
});

//문제 삭제 api O
exports.challengedelete = (async (ctx,next) => {
  const { quiz_num } = ctx.params;
  let { authentication } = ctx.request.header;
  let sql,rows,status,body;

  const challengedelete = async() => {
    sql = `SELECT name FROM quiz WHERE num = ${quiz_num};`;
    rows = await connection.query(sql,() =>{connection.release();});
    authentication = await jwt.jwtverify(authentication);

    if(authentication != '' && rows[0] != undefined){
      sql = `DELETE FROM quiz WHERE makeid = '${authentication}' AND num = ${quiz_num};`;
      await connection.query(sql,() =>{connection.release();});
      await log.setlog(`문제 삭제`,authentication,`${authentication}님이 ${rows[0]['name']}문제를 삭제했습니다.`);
      
      status = 201;
      body = {};
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await challengedelete();
  ctx.status = status;
  ctx.body = body;
});

//문제 파일 추가 api O
exports.fileadd =  (async (ctx,next) => {
  const { quizname } = ctx.request.body;
  let { authentication } = ctx.request.header;
  let sql,rows,status,body;

  const fileadd = async() => {
    sql = `SELECT name FROM quiz WHERE name = '${quizname}';`;
    rows = await connection.query(sql,() =>{connection.release();});
    authentication = await jwt.jwtverify(authentication);

    if(authentication != '' && rows[0] != undefined){
      sql = `UPDATE quiz SET file = '${ctx.request.file.filename}' WHERE makeid = '${authentication}' AND name = '${quizname}';`;
      await connection.query(sql,() =>{connection.release();});
      await log.setlog(`문제 파일추가`,authentication,`${authentication}님이 ${quizname}문제에 파일을 추가했습니다.`);
      
      status = 201;
      body = {};
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await fileadd();
  ctx.status = status;
  ctx.body = body;
});

//문제 파일 삭제 api O
exports.filedelete = (async (ctx,next) => {
  const { quiz_num } = ctx.params;
  let { authentication } = ctx.request.header;
  let sql,rows,status,body;

  const filedelete = async() => {
    sql = `SELECT name FROM quiz WHERE num = ${quiz_num};`;
    rows = await connection.query(sql,() =>{connection.release();});
    authentication = await jwt.jwtverify(authentication);

    if(authentication != '' && rows[0] != undefined){
      sql = `UPDATE quiz SET file = NULL WHERE makeid = '${authentication}' AND num = ${quiz_num};`;
      rows = await connection.query(sql,() =>{connection.release();});
      await log.setlog(`문제 파일삭제`,authentication,`${authentication}님이 ${quiz_num}문제의 파일을 삭제했습니다.`);
      
      status = 201;
      body = {};
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await filedelete();
  ctx.status = status;
  ctx.body = body;
});