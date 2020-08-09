import admin from './admin';//어드민의 정보가 있는 테이블
import email_check from './email_check';//이메일 체크용 테이블
import flags from './flags';//문제들의 플래그가 있는 테이블
import log from './log';//각종 로그 테이블
import quiz from './quiz';//문제에 대한 정보가 있는 테이블
import solved from './solved';//해결된 문제에 대한 정보를 담고있는 테이블
import user from './user';//유저들의 정보가 있는 테이블

module.exports = (Sequelize, sequelize) => {
	return {
    admin: admin(Sequelize, sequelize),
    email_check: email_check(Sequelize, sequelize),
    flags: flags(Sequelize, sequelize),
    log: log(Sequelize, sequelize),
    quiz: quiz(Sequelize, sequelize),
    solved: solved(Sequelize, sequelize),
    user: user(Sequelize, sequelize)
	};
};