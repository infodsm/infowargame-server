module.exports = (Sequelize, sequelize) => {
  const quiz = sequelize.define('quiz', {

    num: {//고유 번호
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    category: {//문제 카테고리
      type: Sequelize.INTEGER,
      allowNull: false
    },

    makeid: {//제작자 아이디
      type: Sequelize.STRING(30),
      allowNull: false
    },

    name: {//문제 이름
      type: Sequelize.STRING(50),
      allowNull: false
    },

    content: {//문제 내용
      type: Sequelize.TEXT,
      allowNull: false
    },

    file: {//문제 파일명
      type: Sequelize.TEXT,
      allowNull: true
    },

    point: {//문제 점수
      type: Sequelize.INTEGER,
      allowNull: false
    }

  }, 
  {freezeTableName: true});
  
  quiz.sync();
  return quiz;
};