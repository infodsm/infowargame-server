import mariadb from 'mariadb';//mariadb 사용 모듈
import send from 'koa-send';

import jwt from './../../lib/token.js';
import log from './../../lib/log.js';
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//문제 목록 불러오기 api 
exports.loadpage = (async (ctx,next) => {
  let check = false;
  let sql,rows;

  const loadpage = async() => {
    sql = `SELECT num,category,makeid,name,point FROM quiz;`;
    rows = await connection.query(sql);
    check = true;
  };

  await loadpage();
  ctx.status = 200;
  ctx.body = {check, collection : rows};
});

//문제 내용 불러오기 api 
exports.loadquiz = (async (ctx,next) => {
  let num = ctx.query.quiz_code;
  let check = false;
  let sql,rows;

  const loadquiz = async() => {

    if(token != ''){
      sql = `SELECT content,file FROM quiz WHERE num = ${num};`;
      rows = await connection.query(sql);
      check = true;
    }
  };

  await loadquiz();
  ctx.status = 200;
  ctx.body = {check, contents: rows[0]['contents'], file: rows[0]['file']};
});

//문제 파일 다운로드 api 
exports.download = (async (ctx,next) => {
  let token = ctx.request.header.token;
  let num = ctx.query.quiz_code;
  let sql,rows;

  const download = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `SELECT file FROM quiz WHERE num = '${num}';`;
      rows = await connection.query(sql);
      await send(ctx, `./files/${rows[0]['file']}`);
    }
  };

  await download();
  ctx.status = 200;
});

//문제 정답 체크 api 
exports.answer = (async (ctx,next) => {
  let token = ctx.request.header.token;
  let num = ctx.query.quiz_code;
  let flag = ctx.request.body.flag;
  let check = false;
  let sql,rows;

  const answer = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `SELECT quiz_id FROM flags WHERE quiz_id = ${num} AND flag = '${flag}';`;
      rows = await connection.query(sql);
      await log.setlog('정답 확인',token,`${token}님께서 ${num} 문제에 답을 ${flag}로 입력하셨습니다.`);

      if (rows[0] != undefined) {
        sql = `INSERT solved(quiz_id,id) VALUES(${num}, '${token}');`;
        rows = await connection.query(sql);
        check = true;
      }
    }
  };

  await answer();
  ctx.status = 201;
  ctx.body = {check};
});

//맞춘 문제 확인하기 api 
exports.quiz = (async (ctx,next) => {
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows;

  const quiz = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `SELECT quiz_id FROM solved WHERE id = '${token}';`;
      rows = await connection.query(sql);
      check = true;
    }
  };

  await quiz();
  ctx.status = 200;
  ctx.body = {check, collection: rows};
});
