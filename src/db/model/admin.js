module.exports = (Sequelize, sequelize) => {
  const admin = sequelize.define('admin', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    id: {//아이디
      type: Sequelize.STRING(30),
      allowNull: false
    },

    password: {//비밀번호
      type: Sequelize.TEXT,
      allowNull: false
    },

    name: {//이름(닉네임)
      type: Sequelize.STRING(30),
      allowNull: false
    },

    date: {//가입일
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }

  }, 
  {freezeTableName: true});
 
  admin.sync();
  return admin;
};