import Usermodel from '../models/user.model';

let updateUser = (id,item) =>{ 
  return Usermodel.updateUser(id,item);
};

module.exports = {
  updateUser:  updateUser
}