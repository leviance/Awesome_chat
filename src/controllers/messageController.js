import {validationResult} from 'express-validator/check';
import {message} from "../sevices/index";
import multer from 'multer';
import {app} from '../config/app';
import {transError,transSuccess} from '../../lang/vi';
import fsExtra from 'fs-extra';


let addNewTextEmoij = async (req,res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }

  try {
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };
    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup

    let newMessage = await message.addNewTextEmoij(sender,receiverId,messageVal,isChatGroup);
    return res.status(200).send({message: newMessage}); 
  } catch (error) {
    return res.status(500).send(error);
  }
};

let storageImageChat = multer.diskStorage({
  destination : (req,file,callback) =>{
    callback(null,app.image_message_directory);
  },
  filename: (req,file,callback) =>{
    let math = app.image_message_type;
    if(math.indexOf(file.mimetype) === -1){
      return callback(transError.image_message_type,null);
    }

    let imageName = `${file.originalname}` ;
    callback(null,imageName);
  }
});


let imageMessageUploadFile = multer({
  storage : storageImageChat,
  limits : {fileSize : app.image_message_limit_size}
}).single("my-image-chat");

let addNewImage = (req,res) => {
  imageMessageUploadFile(req,res, async (error) =>{
    if(error){
      if(error.message) {
        return res.status(500).send(transError.image_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
      let newMessage = await message.addNewImage(sender,receiverId,messageVal,isChatGroup);
      
      //  Remove image because this image is saved to mongoDB
      //await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.filename}`)

      return res.status(200).send({message: newMessage}); 
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

// handle attachment-chat
let storageAttachmentChat = multer.diskStorage({
  destination : (req,file,callback) =>{
    callback(null,app.attachment_message_directory);
  },
  filename: (req,file,callback) =>{
    let attachmentName = `${file.originalname}` ;
    callback(null,attachmentName);
  }
});


let attachmentMessageUploadFile = multer({
  storage : storageAttachmentChat,
  limits : {fileSize : app.attachment_message_limit_size}
}).single("my-attachment-chat");

let addNewAttachment = (req,res) => {
  attachmentMessageUploadFile(req,res, async (error) =>{
    if(error){
      if(error.message) {
        return res.status(500).send(transError.attachment_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
      let newMessage = await message.addNewAttachment(sender,receiverId,messageVal,isChatGroup);
      
      //  Remove attachment because this attachment is saved to mongoDB
      //await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.filename}`)

      return res.status(200).send({message: newMessage}); 
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

module.exports = {
  addNewTextEmoij : addNewTextEmoij,
  addNewImage : addNewImage,
  addNewAttachment : addNewAttachment
}

