module.exports = (Sequelize, sequelize) => {
  const email_check = sequelize.define('email_check', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    id: {//인증할 아이디
      type: 'VARBINARY(30)',
      allowNull: false
    },

    email: {//이메일 주소
      type: Sequelize.STRING(50),
      allowNull: false
    },

    code: {//인증용 코드
      type: Sequelize.INTEGER,
      allowNull: false
    },

    email_check: {//인증용 코드
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }

  }, 
  {freezeTableName: true});
 
  email_check.sync();
  return email_check;
};