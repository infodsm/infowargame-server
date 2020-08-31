import crypto from 'crypto';//암호화 모듈
import mariadb from 'mariadb';//mariadb 사용 모듈
import jwt from './../../lib/token.js';
import mail from './../../lib/mail.js';
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
    sql = `SELECT * FROM user WHERE id = '${id}' AND password = '${password}';`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      token = await jwt.jwtsign(id);
      check = true;
    }   
  };

  await login();
  ctx.status = 200;
  ctx.body = {check,token};
});

//회원가입 api 0
exports.signup = (async (ctx,next) => {
  const id = ctx.request.body.id;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  const nickname = ctx.request.body.nickname;
  const email = ctx.request.body.email;
  const team = ctx.request.body.team;
  let check = false;
  let sql,rows,rows1,rows2;

  const signup = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);
    sql = `SELECT email FROM user WHERE email = '${email}';`;
    rows1 = await connection.query(sql);
    sql = `SELECT id FROM email_check WHERE id = '${id}' AND email = '${email}' AND email_check = true;`;
    rows2 = await connection.query(sql);

    console.log(rows[0]);
    console.log(rows1[0]);
    console.log(rows2[0]);
    if(rows[0] == undefined && rows1[0] == undefined && rows2[0] != undefined){
      sql = `INSERT INTO user(name,id,password,team,email,score) values('${nickname}','${id}','${password}','${team}','${email}',0);`;
      await connection.query(sql);
      check = true;
    }
  };

  await signup();
  ctx.status = 201;
  ctx.body = {check};
});

//아이디 중복체크 api 0
exports.idcheck = (async (ctx,next) => {
  const id = ctx.query.id;
  let check = false;
  let sql,rows;

  const idcheck = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);

    if(rows[0] == undefined){ check = true; }
    console.log(check);
  };

  await idcheck();
  ctx.status = 200;
  ctx.body = {check};
});

//이메일 인증 보내기 api 0
exports.emailsend = (async (ctx,next) => {
  const id = ctx.query.id;
  const email = ctx.request.body.email;
  let check = false;
  let sql,rows,result;
  
  const emailsend = async() => {
    sql = `SELECT id FROM email_check WHERE id = '${id}';`;
    rows = await connection.query(sql);
    result = Math.floor(Math.random() * 1000000)+100000;
    if(result>1000000){ result = result - 100000; }

    if(rows[0] == undefined){ sql = `INSERT INTO email_check(id,email,code) VALUES('${id}','${email}',${result});`; }
    else{ sql = `UPDATE email_check SET code = ${result}, email = '${email}' WHERE id = '${id}';`; }

    await connection.query(sql);
    await mail.sendmail(email,'infowargame 이메일 인증번호',`당신의 이메일 인증 코드입니다 ${result}`);

    check = true;
  };

  await emailsend();
  ctx.status = 201;
  ctx.body = {check};
});

//이메일 인증 확인 api 0
exports.emailcheck = (async (ctx,next) => {
  const id = ctx.query.id;
  const code = ctx.query.code;
  let check = false;
  let sql,rows;

  const emailcheck = async() => {
    sql = `SELECT * FROM email_check WHERE id = '${id}' AND code = ${code};`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      sql = `UPDATE email_check SET email_check = 1 WHERE id = '${id}' AND code = ${code};`;
      rows = await connection.query(sql);
      check = true; 
    }
  };

  await emailcheck();
  console.log(check);
  ctx.status = 200;
  ctx.body = {check};
});

//내 정보 불러오기 api 0
exports.mypage = (async (ctx,next) => {
  const token = ctx.request.header.token;
  let jwtSecret = process.env.secretjwt;
  let check,id,nickname,email,team,score;
  let sql,rows;

  const mypage = async() => {
    check = await jwt.jwtverify(token);

    if (check){
      sql = `SELECT id,name,email,team,score FROM user WHERE id = '${check}'`;
      rows = await connection.query(sql);
      id = rows[0]['id'];
      nickname = rows[0]['name'];
      email = rows[0]['email'];
      team = rows[0]['team'];
      score = rows[0]['score'];
    }
  };

  await mypage();
  ctx.status = 200;     
  ctx.body = {id,nickname,email,team,score};
});

//내 정보 변경 api 0
exports.changemyinfo = (async (ctx,next) => {
  const token = ctx.request.header.token;
  const id = ctx.request.body.id;
  const password = ctx.request.body.password;
  const nickname = ctx.request.body.nickname;
  const email = ctx.request.body.email;
  const team = ctx.request.body.team;
  const change_name = ['team','password','name','email','id'];
  const change_value = [team,password,nickname,email,id];
  let check,i,sql,rows;

  if(password != false){ password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex'); }

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
    }

  };

  await change();
  ctx.status = 201;
  ctx.body = {check};
});

//비밀번호 찾기 api 0
exports.findpassword = (async (ctx,next) => {
  const id = ctx.query.id;
  const email = ctx.request.body.email;
  let check = false;
  let sql,rows,result,new_password;
  
  const findpassword = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}' AND email = '${email}';`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      result = Math.random().toString(36).substr(2,11);
      new_password = crypto.createHmac('sha256', process.env.secret).update(result).digest('hex');
      sql = `UPDATE user SET password = '${new_password}' WHERE id = '${id}' AND email = '${email}';`; 
    }
    else{ return; }

    await connection.query(sql);
    await mail.sendmail(email,'infowargame 바뀐 비밀번호',`바뀐 비밀번호 입니다 ${result}`);

    check = true;
  };

  await findpassword();
  ctx.status = 201;
  ctx.body = {check};
});