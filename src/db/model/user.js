module.exports = (Sequelize, sequelize) => {
  const user = sequelize.define('user', {
    
    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    name: {//이름(닉네임)
      type: Sequelize.STRING(30),
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

    team: {//팀명
      type: Sequelize.STRING(30),
      allowNull: true
    },

    email: {//이메일 주소
      type: Sequelize.STRING(30),
      allowNull: true
    },

    score: {//점수
      type: Sequelize.INTEGER,
      allowNull: true
    },

    rank: {//랭크
      type: Sequelize.INTEGER,
      allowNull: true
    },

  }, 
  {freezeTableName: true});
 
  user.sync();
  return user;
};