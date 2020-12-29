import mariadb from 'mariadb';//mariadb 사용 모듈

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

let sql;
sql = `INSERT user(name,id,password,team,email,score) VALUES('test1','test1','1234','test','test1@gmail.com',0);`;
await connection.query(sql,() =>{connection.release();});
sql = `INSERT admin(id,password,name) VALUES('admin1','1234','admin1');`;
await connection.query(sql,() =>{connection.release();});

return;