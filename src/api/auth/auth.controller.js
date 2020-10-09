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
 
//로그인 api o
exports.login = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  let sql,rows,status,body,token;

  const login = async() => {
    sql = `SELECT * FROM user WHERE id = '${id}' AND password = '${password}';`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){  
      token = await jwt.jwtsign(id); 
      status = 201;
      body = {token};
    }else{
      status = 403;
      body = {"message" : "your id or password id wrong"};
    }
  };

  await login();
  ctx.status = status;
  ctx.body = body;
});

//회원가입 api o
exports.signup = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const password = crypto.createHmac('sha256', process.env.secret).update(ctx.request.body.password).digest('hex');
  const { nickname } = ctx.request.body;
  const { email } = ctx.request.body;
  const { team } = ctx.request.body;
  let sql,rows,rows1,rows2,status,body;

  const signup = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);
    sql = `SELECT email FROM user WHERE email = '${email}';`;
    rows1 = await connection.query(sql);
    sql = `SELECT id FROM email_check WHERE id = '${id}' AND email = '${email}' AND email_check = true;`;
    rows2 = await connection.query(sql);

    if(rows[0] == undefined && rows1[0] == undefined && rows2[0] != undefined){
      sql = `INSERT INTO user(name,id,password,team,email,score) values('${nickname}','${id}','${password}','${team}','${email}',0);`;
      await connection.query(sql);
      status = 201;
      body = {};
    }else{
      status = 403;
      body = {"message" : "your id or password or email wrong"};
    }
  };

  await signup();
  ctx.status = status;
  ctx.body = body;
});

//아이디 중복체크 api o
exports.idcheck = (async (ctx,next) => {
  const { id } = ctx.params;
  let sql,rows,status,body;

  const idcheck = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}';`;
    rows = await connection.query(sql);

    if(rows[0] == undefined){ 
      status = 200; 
      body = {}; 
    }
    else{ 
      status = 403;
      body = {"message" : "you can't use that id"};
    }
  };

  await idcheck();
  ctx.status = status;
  ctx.body = body;
});

//이메일 인증 보내기 api 로직 체크 필요
exports.emailsend = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const { email } = ctx.request.body;
  const result = await mail.makecode();
  let sql,rows,status,body;
  
  const emailsend = async() => {
    sql = `SELECT id FROM email_check WHERE id = '${id}';`;
    rows = await connection.query(sql);

    if(rows[0] == undefined){ sql = `INSERT INTO email_check(id,email,code) VALUES('${id}','${email}',${result});`; }
    else{ sql = `UPDATE email_check SET code = ${result}, email = '${email}' WHERE id = '${id}';`; }

    await connection.query(sql);
    await mail.sendmail(email,'infowargame 이메일 인증번호',`당신의 이메일 인증 코드입니다 ${result}`).then(() =>{
      status = 201;
      body = {};
    });

  };

  await emailsend();
  ctx.status = status;
  ctx.body = body;
});

//이메일 인증 확인 api 0
exports.emailcheck = (async (ctx,next) => {
  const { id } = ctx.query;
  const { code } = ctx.query;
  let sql,rows,status,body;

  const emailcheck = async() => {
    sql = `SELECT * FROM email_check WHERE id = '${id}' AND code = ${code};`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      sql = `UPDATE email_check SET email_check = 1 WHERE id = '${id}' AND code = ${code};`;
      rows = await connection.query(sql);
      status = 202; 
      body = {};
    }else{
      status = 404; 
      body = {"message" : "code is wrong"};    
    }
  };

  await emailcheck();
  ctx.status = status;
  ctx.body = body;
});

//비밀번호 찾기 api 0
exports.findpassword = (async (ctx,next) => {
  const { id } = ctx.request.body;
  const { email } = ctx.request.body;
  const result = Math.random().toString(36).substr(2,11);
  const new_password = crypto.createHmac('sha256', process.env.secret).update(result).digest('hex');
  let sql,rows,status,body;
  
  const findpassword = async() => {
    sql = `SELECT id FROM user WHERE id = '${id}' AND email = '${email}';`;
    rows = await connection.query(sql);

    if(rows[0] != undefined){ 
      sql = `UPDATE user SET password = '${new_password}' WHERE id = '${id}' AND email = '${email}';`; 
      await connection.query(sql);

      await mail.sendmail(email,'infowargame 바뀐 비밀번호',`바뀐 비밀번호 입니다 ${result}`);
      status = 200;
      body = {};
    }else{ 
      status = 404;
      body = {"message" : "id or email is wrong"};
    }

  };

  await findpassword();
  ctx.status = status;
  ctx.body = body;
});