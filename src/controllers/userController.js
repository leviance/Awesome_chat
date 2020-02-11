import multer from 'multer';
import {app} from '../config/app';
import {transError,transSuccess} from '../../lang/vi';
import uuidv4 from 'uuid/v4';
import {user} from '../sevices/index';
import fsExtra from 'fs-extra';
import {validationResult} from 'express-validator/check';

let storageAvatar = multer.diskStorage({
  destination : (req,file,callback) =>{
    callback(null,app.avatar_directory);
  },
  filename: (req,file,callback) =>{
    let math = app.avatar_type;
    if(math.indexOf(file.mimetype) === -1){
      return callback(transError.avatar_type,null);
    }

    let avatarName =  + Date.now() + '-' + uuidv4() + '-' + file.originalname  ;
    callback(null,avatarName);
  }
});

let avatarUploadFile = multer({
  storage : storageAvatar,
  limits : {fileSize : app.avatar_limit_size}
}).single("avatar");

let upDateAvatar = (req,res) =>{
  avatarUploadFile(req,res, async (error) =>{
    if(error){
      if(error.message) {
        return res.status(500).send(transError.avatar_size);
      }
      return res.status(500).send(error);
    }
    try {
      let updateUserItem = {
        avatar : req.file.filename,
        updatedAt : Date.now()
      };
      let userUpdate = await user.updateUser(req.user._id,updateUserItem);
      //await fsExtra.remove(app.avatar_directory + '/' + userUpdate.avatar); 
      let result = {
        message : transSuccess.avatar_updated,
        imgageSrc: '/images/users/' + req.file.filename
      }
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });
};

let updateInfor = async (req,res) =>{
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }
  try {
    let updateUserItem = req.body;
    await user.updateUser(req.user._id,updateUserItem);
    let result = {
      message : transSuccess.user_info_updated
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

let updatePassword = async (req, res) => {
  let errorsArr = [] ; 

  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    return res.status(500).send(errorsArr);
  }

  try {
    let updateUserItem = req.body;

    await user.updatePassword(req.user._id,updateUserItem);

    let result = {
      message : transSuccess.user_password
    };
    return res.status(200).send(result);

  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = { 
  upDateAvatar : upDateAvatar,
  updateInfor : updateInfor,
  updatePassword : updatePassword
};