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
)};
