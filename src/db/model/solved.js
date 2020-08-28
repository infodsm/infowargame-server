module.exports = (Sequelize, sequelize) => {
  const solved = sequelize.define('solved', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    quiz_id: {//해결한 문제의 아이디
      type: Sequelize.INTEGER,
      allowNull: false
    },

    id: {//하결한 유저의 아이디
      type: 'VARBINARY(30)',
      allowNull: false
    },

    date: {//시간
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }
  }, 
  {freezeTableName: true});
 
  solved.sync();
  return solved;
};