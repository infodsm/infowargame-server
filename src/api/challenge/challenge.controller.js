import mariadb from 'mariadb';//mariadb 사용 모듈
import send from 'koa-send';

import jwt from './../../lib/token.js';
import log from './../../lib/log.js';
import rank from './../../lib/rank.js';
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
  let sql,rows,status,body;

  const loadpage = async() => {
    sql = `SELECT num,category,makeid,name,point FROM quiz;`;
    rows = await connection.query(sql,() =>{connection.release();});

    status = 200;
    body = {collection : rows};
  };

  await loadpage();
  ctx.status = status;
  ctx.body = body;
});

//문제 내용 불러오기 api 
exports.loadquiz = (async (ctx,next) => {
  let { quiz_code } = ctx.params;
  let sql,rows,status,body;

  const loadquiz = async() => {
    sql = `SELECT content,file FROM quiz WHERE num = ${quiz_code};`;
    rows = await connection.query(sql,() =>{connection.release();});

    if(rows[0] != undefined){
      status = 200;
      body = {content: rows[0]['content'], file: rows[0]['file']};
    }else{
      status = 404;
      body = {"message" : "can't found challenge"};
    }
  };

  await loadquiz();
  ctx.status = status;
  ctx.body = body;
});

//문제 파일 다운로드 api 
exports.download = (async (ctx,next) => {
  let { quiz_code } = ctx.params;
  let sql,rows,body,status;

  const download = async() => {
    sql = `SELECT file FROM quiz WHERE num = '${quiz_code}';`;
    rows = await connection.query(sql,() =>{connection.release();});

    if(rows[0] != undefined){
      await send(ctx, `./files/${rows[0]['file']}`);
    }else{
      ctx.body = {"message" : "can't found file"};
      ctx.status = 404;
    }
  };

  await download();

});

//문제 정답 체크 api 
exports.answer = (async (ctx,next) => {
  const { quiz_code } = ctx.params;
  const { flag } = ctx.request.body;
  let { authentication } = ctx.request.header;
  let sql,rows,rows1,status,body;

  const answer = async() => {
    authentication = await jwt.jwtverify(authentication);

    if(authentication != ''){
      sql = `SELECT num,point FROM quiz WHERE num = ${quiz_code} AND flag = '${flag}';`;
      rows = await connection.query(sql,() =>{connection.release();});
      sql = `SELECT quiz_id FROM solved WHERE quiz_id = ${quiz_code} AND id = '${authentication}';`;
      rows1 = await connection.query(sql,() =>{connection.release();});
      await log.setlog('정답 확인',authentication,`${authentication}님께서 ${quiz_code} 문제에 답을 ${flag}로 입력하셨습니다.`);

      if (rows[0] != undefined && rows1[0] == undefined) {//맞았을때
        sql = `INSERT solved(quiz_id,id) VALUES(${quiz_code}, '${authentication}');`;
        await connection.query(sql,() =>{connection.release();});

        sql = `UPDATE user SET score = score + ${rows[0]['point']} WHERE name = '${authentication}';`;
        await connection.query(sql,() =>{connection.release();});

        await rank.rank();

        status = 201;
        body = {"message" : "correct!!"};
      }else{
        status = 403;
        body = {"message" : "wrong answer"};
      }
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await answer();
  ctx.status = status;
  ctx.body = body;
});

//맞춘 문제 확인하기 api 
exports.quiz = (async (ctx,next) => {
  let { authentication } = ctx.request.header;
  let sql,rows,status,body;

  const quiz = async() => {
    authentication = await jwt.jwtverify(authentication);

    if(authentication != ''){
      sql = `SELECT quiz_id FROM solved WHERE id = '${authentication}';`;
      rows = await connection.query(sql,() =>{connection.release();});
      status = 200;
      body = {"contents" : rows};
    }else{
      status = 404;
      body = {"message" : "your authentication is wrong"};
    }
  };

  await quiz();
  ctx.status = status;
  ctx.body = body;
});
