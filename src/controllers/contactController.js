import {contact} from '../sevices/index';
import {validationResult} from 'express-validator/check';

let finndUsersContact = async (req,res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyWord = req.params.keyWord;

    let users = await contact.finndUsersContact(currentUserId,keyWord); 
    return res.render("main/contact/sessions/_findUsersContact",{users});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let addNew = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);
    res.status(200).send({success: !!newContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let removeRequestContact = async (req,res) => {
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContact(currentUserId, contactId);
    res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  finndUsersContact : finndUsersContact,
  addNew : addNew,
  removeRequestContact : removeRequestContact
}