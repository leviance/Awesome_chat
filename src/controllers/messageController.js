import {validationResult} from 'express-validator/check';
import {message} from "../sevices/index";
import multer from 'multer';
import {app} from '../config/app';
import {transError,transSuccess} from '../../lang/vi';
import fsExtra from 'fs-extra';
import ejs from 'ejs';
import {lastItemOfArr,convertTimestampToHumanTime,bufferToBase64} from '../helpers/clientHeper';
import {promisify} from 'util';

const renderFile = promisify(ejs.renderFile).bind(ejs);

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

let readMoreAllChat = async (req,res) =>{
  try {
    let skipPersonal = +(req.query.skipPersonal);
    let skipGroup = +(req.query.skipGroup);

    let newAllConversation = await message.readMoreAllChat(req.user._id, skipPersonal,skipGroup);

    let dataToRender = {
      newAllConversation : newAllConversation,
      convertTimestampToHumanTime : convertTimestampToHumanTime,
      lastItemOfArr : lastItemOfArr,
      bufferToBase64 : bufferToBase64,
      user : req.user
    };

    let leftSideData = await renderFile("src/views/main/readMoreConversations/_leftSide.ejs",dataToRender);
    let rightSideData = await renderFile("src/views/main/readMoreConversations/_rightSide.ejs",dataToRender);
    let imageModalData = await renderFile("src/views/main/readMoreConversations/_imageModal.ejs",dataToRender);
    let attachmentModalData = await renderFile("src/views/main/readMoreConversations/_attachmentModal.ejs",dataToRender);

    return res.status(200).send({
      leftSideData,
      rightSideData,
      imageModalData,
      attachmentModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMore = async (req,res) =>{
  try {
    let skipMessage = +(req.query.skipMessage);
    let targetId = req.query.targetId;
    let chatInGroup = (req.query.chatInGroup === "true");

    let newMessage = await message.readMore(req.user._id, skipMessage,targetId,chatInGroup);

    let dataToRender = {
      newMessage : newMessage,
      bufferToBase64 : bufferToBase64,
      user : req.user
    };

    let rightSideData = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs",dataToRender);
    let imageModalData = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs",dataToRender);
    let attachmentModalData = await renderFile("src/views/main/readMoreMessages/_attachmentModal.ejs",dataToRender);

    return res.status(200).send({
      rightSideData,
      imageModalData,
      attachmentModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewTextEmoij : addNewTextEmoij,
  addNewImage : addNewImage,
  addNewAttachment : addNewAttachment,
  readMoreAllChat : readMoreAllChat,
  readMore : readMore
}

