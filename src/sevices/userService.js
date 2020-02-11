import Usermodel from '../models/user.model';
import {transError} from '../../lang/vi';
import bcrypt from 'bcrypt';

const saultRounds = 7;

let updateUser = (id,item) =>{ 
  return Usermodel.updateUser(id,item);
};

let updatePassword = (id,dataUpdate) =>{ 
  return new Promise( async (resolve, reject) =>{
    let currentUser = await Usermodel.findUserByIdToUpdatePassword(id);
    if(!currentUser){
      return reject(transError.user_undefined);
    }
   
    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.current_password);
    if(!checkCurrentPassword){
      return reject(transError.user_curent_password_failed);
    }

    let salt = bcrypt.genSaltSync(saultRounds);
    await Usermodel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt));
    resolve(true);
  });
}
module.exports = {
  updateUser:  updateUser,
  updatePassword : updatePassword
}