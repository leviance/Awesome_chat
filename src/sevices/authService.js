import Usermodel from '../models/user.model';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import {transError, transSuccess, transmail} from '../../lang/vi';
import sendMail from '../config/mailler';
import { auth } from '.';

let saultRounds = 7;

let register = (email,gender,password, protocol, host) =>{

  return new Promise( async (resolve, reject) =>{

  let userByEmail = await Usermodel.findbyemail(email);
  if(userByEmail) {
    if(userByEmail.removedAt != null) {
      return reject(transError.account_removed);
    }
    if(!userByEmail.local.isActive) {
      return reject(transError.account_not_active);
    }
    return reject(transError.account_in_use);
  }

  let salt = bcrypt.genSaltSync(saultRounds);

  let userItem = {
    username: email.split('@')[0],
    gemder : gender,
    local : {
      email : email,
      password : bcrypt.hashSync(password,salt), 
      verifytoken : uuid()
    }
  };

  let user = await Usermodel.createNew(userItem);
  let linkVeryfy = protocol + '://' + host + '/verify/' + user.local.verifytoken;

  sendMail(email, transmail.subject, transmail.template(linkVeryfy))
    .then(success =>{
      resolve(transSuccess.userCreated(user.local.email)); 
    })
    .catch( async (error) =>{
      await Usermodel.removeById(user._id);
      console.log(error);
      reject(transmail.send_fail);
    });
  });
};

let verifyAccount = (token) => {
  return new Promise( async (resolve, reject) =>{
    let userByToken = await Usermodel.verifytoken(token);
    if(!userByToken){
      return reject(transError.token_undifined);
    }
    await Usermodel.verify(token);
    resolve(transSuccess.account_acctive);
  });
}

module.exports = {
  register : register,
  verifyAccount : verifyAccount
};