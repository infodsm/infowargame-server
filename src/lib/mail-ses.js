import ses from 'node-ses';
import dotenv from 'dotenv';
dotenv.config();

const client = ses.createClient({key: process.env.sesKey, secret: process.env.sesSecret});

exports.sendmail = (async (email,mailsubject,contents) => {

  const option = {
    to: email,
    from: process.env.emailid,
    subject: mailsubject,
    message: contents,
    altText: 'plain text'
  }; 

  client.sendEmail(option, (err, data, res) => {
    console.log(err);
    console.log(data);
    console.log(res);
  });
});

exports.makecode = (async () => {

  let result = Math.floor(Math.random() * 1000000)+100000;
  if(result>1000000){ result = result - 100000; }

  return result;
});