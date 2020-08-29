import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

exports.jwtsign = (async (id) => {
  const token = jwt.sign({ id: `${id}` },process.env.secretjwt,{expiresIn: '2h'});
  return token;
});

exports.jwtverify = (async (token) => {
  let check;
  jwt.verify(token, process.env.secretjwt, (error, decoded) => {
    if(error){ check = ''; }
    else{
      check = decoded['id'];
    }
  });
  return check;
});