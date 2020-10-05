import crypto from 'crypto';//암호화 모듈
import mariadb from 'mariadb';//mariadb 사용 모듈

import jwt from '../../lib/token.js';
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


//내 정보 불러오기 api 0
exports.myaccount = (async (ctx,next) => {
  const token = ctx.request.header.authentication;
  let sql,rows,status,body,check;

  const mypage = async() => {
    check = await jwt.jwtverify(token);

    sql = `SELECT id,name,email,team,score FROM user WHERE id = '${check}'`;
    rows = await connection.query(sql);

    if(rows[0] != undefined && check){
      status = 200;
      body = {
        "id" : `${rows[0]['id']}`, 
        "nickname" : `${rows[0]['name']}`, 
        "email" : `${rows[0]['email']}`, 
        "team" : `${rows[0]['team']}`, 
        "score" : `${rows[0]['score']}`
      };
    }else{
      status = 404;
      body = {"message" : "your token is wrong"};
    }
  };

  await mypage();
  ctx.status = status;     
  ctx.body = body;
});

//내 정보 변경 api 0
exports.change = (async (ctx,next) => {
  const token = ctx.request.header.authentication;
  const id = ctx.request.body.id;
  const password = ctx.request.body.password;
  const nickname = ctx.request.body.nickname;
  const email = ctx.request.body.email;
  const team = ctx.request.body.team;
  const change_name = ['team','password','name','email','id'];
  let change_value = [team,password,nickname,email,id];
  let check,i,sql,rows,status,body;

  if(password != false){ change_value[1] = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex'); }

  const change = async() => {
    check = await jwt.jwtverify(token);

    if (check != false){
      for (i = 0; i < 5; i++) {
        if (change_value[i] != false) {
          console.log(`id가 ${check}인 사람의 ${change_name[i]}를 ${change_value[i]}로 바꿉니다.`);
          sql = `UPDATE user set ${change_name[i]} = '${change_value[i]}' WHERE id = '${check}';`;
          rows = await connection.query(sql);
        }
      }
      status = 201;
      body = {};
    }else{
      status = 404;
      body = {"message" : "you can't change"};
    }
  };

  await change();
  ctx.status = status;
  ctx.body = body;
});

//50위 랭킹 불러오기 api 0
exports.rank = (async (ctx,next) => {
  let token = ctx.request.header.authentication;
  let sql,rows,rows1,status,body;

  const load = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `SELECT name, score,rank FROM user ORDER BY score LIMIT 50;`;
      rows = await connection.query(sql); 

      sql = `SELECT name, score,rank FROM user WHERE id = '${token}';`;
      rows1 = await connection.query(sql);

      status = 200;
      body = {"contents" : rows, "mydata" : rows1};
    }else{
      status = 404;
      body = {"message" : "your token is wrong"};
    }
  };

  await load();
  ctx.status = status;
  ctx.body = body;
});

//유저 검색 api 0
exports.searchuser = (async (ctx,next) => {
  let token = ctx.request.header.authentication;
  const search = ctx.request.body.search;
  const property = ctx.request.body.property;
  let sql,rows,status,body;

  const searchuser = async() => {
    token = await jwt.jwtverify(token);

    if(token != ''){
      sql = `SELECT name,id,team,email,score,rank FROM user WHERE ${property} = '${search}';`;
      rows = await connection.query(sql);
      status = 200;
      body = {"contents" : rows};
    }else{
      status = 404;
      body = {"message" : "your token is wrong"};
    }
  };

  await searchuser();
  ctx.status = status;
  ctx.body = body;
});