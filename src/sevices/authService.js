import Usermodel from '../models/user.model';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import {transError, transSuccess, transmail} from '../../lang/vi';
import sendMail from '../config/mailler';

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

  // sendMail(email, transmail.subject, transmail.template(linkVeryfy));
  resolve(transSuccess.userCreated(user.local.email)); 
  });
};

module.exports = {
  register : register
};