import ContactModel from '../models/contact.model';
import UserModel from '../models/user.model';
import ChatGroupModel from '../models/chatGroup.model';
import MessageModel from '../models/message.model';
import _ from 'lodash';

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

let getAllConversationItems = (currentUserId) =>{ 
  return new Promise( async(resolve, reject) =>{
    try {
      let contacts = await ContactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
      let userConversationsPromise = contacts.map( async (contact) =>{
        if(contact.contactId == currentUserId){
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }        
      });
      // convert data 
      let userConversationsArr = await Promise.all(userConversationsPromise);
      let groupConversationsArr = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN );

      let userConversations = [];
      let groupConversations = [];

      userConversationsArr.forEach(data => {
        userConversations.push(data._doc);
      })

      groupConversationsArr.forEach(data => {
        groupConversations.push(data._doc);
      })
      // end convert data
     
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) =>{ 
        return -item.updatedAt;
      });

      let allConversationWithMessagePromise = allConversations.map( async (conversation) =>{
        let getMessages = await MessageModel.model.getMessages(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);
        
        //conversation = conversation.toObject();
        conversation.messages = getMessages;
        return conversation;
      });

      let allConversationWithMessage = await Promise.all(allConversationWithMessagePromise);

      allConversationWithMessage = _.sortBy(allConversationWithMessage, (item) =>{ 
        return -item.updatedAt
      });

      resolve({
        userConversations : userConversations,
        groupConversations : groupConversations,
        allConversations : allConversations,
        allConversationWithMessage : allConversationWithMessage
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllConversationItems : getAllConversationItems
}


