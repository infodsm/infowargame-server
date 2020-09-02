module.exports = (Sequelize, sequelize) => {
  const flags = sequelize.define('flags', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    quiz_id: {//문제 아이디
      type: Sequelize.INTEGER,
      allowNull: false
    },

    flag: {//플래그
      type: Sequelize.STRING(50),
      allowNull: false
    }

  }, 
  {freezeTableName: true});
 
  flags.sync();
  return flags;
};