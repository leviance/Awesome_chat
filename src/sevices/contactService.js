import ContactModel from "../models/contact.model";
import UserModel from "../models/user.model";
import _ from "lodash";

let finndUsersContact = (currentUserId,keyWord) => {
  return new Promise( async (resolve, reject) =>{
    let deprecatedUserId = []; 
    let contactByUser = await ContactModel.findAllByUser(currentUserId);
    contactByUser.forEach(contact =>{
      deprecatedUserId.push(contact.userId);
      deprecatedUserId.push(contact.contactId);
    });

    deprecatedUserId = _.uniqBy(deprecatedUserId);
    let users = await UserModel.findAllForAddContact(deprecatedUserId,keyWord);
    resolve(users);
  });
  
}

module.exports = {
  finndUsersContact : finndUsersContact
}