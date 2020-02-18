import {validationResult} from 'express-validator/check';
import {groupChat} from './../sevices/index';

let addNewGroup = async (req,res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user.id;
    let arrayMemberIds = req.body.arrayIds;
    let groupChatName = req.body.groupChatName;

    let newGroupChat = await groupChat.addNewGroup(currentUserId,arrayMemberIds,groupChatName);
    return res.status(200).send({groupChat : newGroupChat});
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup : addNewGroup
}