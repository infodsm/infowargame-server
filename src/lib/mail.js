import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.emailid,
    pass: process.env.emailpassword,
  },
});

exports.sendmail = (async (email,mailsubject,contents) => {

  let info = await transporter.sendMail({
    from: `"infowargame Team" <${process.env.emailid}>`,
    to: email,

    subject: mailsubject,
    text: contents,
  });

  console.log(`Message sent: ${info.messageId}`);
  return;
});

exports.makecode = (async () => {

  let result = Math.floor(Math.random() * 1000000)+100000;
  if(result>1000000){ result = result - 100000; }

  return result;
});