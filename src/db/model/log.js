module.exports = (Sequelize, sequelize) => {
  const log = sequelize.define('log', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    name: {//로그 제목
      type: Sequelize.TEXT,
      allowNull: false
    },

    id: {//당사자 아이디
      type: Sequelize.STRING(30),
      allowNull: false
    },

    contents: {//로그 주 내용
      type: Sequelize.TEXT,
      allowNull: false
    },

    date: {//시간
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }
    
  }, 
  {freezeTableName: true});
 
  log.sync();
  return log;
};