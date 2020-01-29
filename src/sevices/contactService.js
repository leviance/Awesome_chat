import ContactModel from "../models/contact.model";
import UserModel from "../models/user.model";
import NotificationModel from "../models/notification.model";
import _ from "lodash";

let finndUsersContact = (currentUserId,keyWord) => {
  return new Promise( async (resolve, reject) =>{
    
    let deprecatedUserId = [currentUserId]; 
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

let addNew = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let contactExists = await ContactModel.checkExists(currentUserId,contactId);
    if(contactExists){
      return reject(false);
    }
    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);

    // create notification
    let notificationItem = {
      senderId : currentUserId,
      receiverId : contactId,
      type : NotificationModel.types.ADD_CONTACT
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  }); 

} 

let removeRequestContact = (currentUserId,contactId) => {
  return new Promise( async (resolve, reject) =>{
    let removeReq = await ContactModel.removeRequestContact(currentUserId,contactId);
    if(removeReq.result.n === 0){
      return reject(false);
    }
    // remove notification
    let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactNotification(currentUserId,contactId,notifTypeAddContact);
    resolve(true);
  }); 

} 

module.exports = {
  finndUsersContact : finndUsersContact,
  addNew : addNew,
  removeRequestContact : removeRequestContact
}