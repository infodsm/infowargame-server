import Sequelize from 'sequelize';
import model from './model';

require('dotenv').config()//환경변수를 코드에서 제거하기 위한 모듈

 
const sequelize = new Sequelize(process.env.database , process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mariadb',
  dialectOptions: { timezone: 'Etc/GMT+9'},
  define: {
  timestamps: false,
  charset:'utf8',
  collate:'utf8_general_ci',
  }
});

const models = model(Sequelize, sequelize);
 
module.exports = {
  Sequelize,
  sequelize,
  models
};