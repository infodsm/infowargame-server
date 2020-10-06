import mariadb from 'mariadb';//mariadb 사용 모듈

const connection = mariadb.createPool({//db 연결용 변수, 내부 변수는 환경변수로 설정.
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

exports.setlog = (async (name,id,contents) => {
  let sql,rows;

  sql = `INSERT log(name,id,content) VALUES('${name}','${id}','${contents}')`;
  rows = await connection.query(sql);

  return;
});