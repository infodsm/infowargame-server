import mariadb from 'mariadb';//mariadb 사용 모듈

import jwt from './../../lib/token.js';
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//50위 랭킹 불러오기 api 0
exports.search = (async (ctx,next) => {/*
  let token = ctx.request.header.token;
  let check = false;
  let sql,rows,rows1;

  const search = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `
      SELECT @num:=@num+1 AS num, name, score
      FROM (SELECT @num:=0) AS n, user
      ORFER BY(score)
      LIMIT(50);`;
      rows = await connection.query(sql); 

      sql = `SELECT * FROM user WHERE ${column} = '${srch}';`;
      rows1 = await connection.query(sql);

      check = true;
    }
  };

  await search();
  ctx.status = 200;
  ctx.body = {check, contents : rows};*/
});
