import Usermodel from '../models/user.model';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import {transError, transSuccess} from '../../lang/vi';

let saultRounds = 7;

let register = (email,gender,password) =>{

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
  resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = {
  register : register
};