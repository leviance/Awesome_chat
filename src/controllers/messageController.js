import {validationResult} from 'express-validator/check';
import {message} from "../sevices/index";

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

module.exports = {
  addNewTextEmoij : addNewTextEmoij
}