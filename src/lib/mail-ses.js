import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();


const SES_CONFIG = {
    accessKeyId: process.env.sesKey,
    secretAccessKey: process.env.sesSecret,
    region: 'ap-northeast-2c',
};
const AWS_SES = new AWS.SES(SES_CONFIG);


exports.sendmail = (async (email,mailsubject,contents) => {

  let params = {
    Source: process.env.emailid,
    Destination: {ToAddresses: [email]},
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 'This is the body of my email!',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Hello!`,
      }
    }
  };
  return AWS_SES.sendEmail(params).promise();
});

exports.makecode = (async () => {

  let result = Math.floor(Math.random() * 1000000)+100000;
  if(result>1000000){ result = result - 100000; }

  return result;
});