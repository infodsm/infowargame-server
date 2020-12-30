import mariadb from 'mariadb';//mariadb 사용 모듈
import crypto from 'crypto';//암호화 모듈
import dotenv from 'dotenv';//환경변수를 코드에서 제거하기 위한 모듈
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

let sql;
let password = crypto.createHmac('sha256', process.env.secret).update('1234').digest('hex');

sql = `INSERT user(name,id,password,team,email,score) VALUES('test1','test1','${password}','test','test1@gmail.com',0);`;
connection.query(sql,() =>{connection.release();});
sql = `INSERT admin(id,password,name) VALUES('admin1','${password}','admin1');`;
connection.query(sql,() =>{connection.release();});

