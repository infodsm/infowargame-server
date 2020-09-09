import mariadb from 'mariadb';//mariadb 사용 모듈
import dotenv from 'dotenv';
dotenv.config();

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


exports.rank = (async () => {
  let sql,rows;

  sql = `SELECT num FROM user ORDER BY rank ASC;`;
  rows = await connection.query(sql);

  for (let i = 1; i <= rows.length; i++) {
    sql = `UPDATE user SET rank = ${i} WHERE num = ${rows[i-1]['num']};`;
    rows = await connection.query(sql);
  }
});