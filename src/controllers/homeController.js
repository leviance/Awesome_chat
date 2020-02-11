import {notification,contact, message} from '../sevices/index';
import {bufferToBase64, lastItemOfArr,convertTimestampToHumanTime} from '../helpers/clientHeper';

let homeController = async (req,res) => {
  // only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  // get amount notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts
  let contacts = await contact.getContacts(req.user._id);

  // get contacts sent
  let contactsSent = await contact.getContactsSent(req.user._id);

  // get contacts receiver
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  let allConversationWithMessage = getAllConversationItems.allConversationWithMessage;

  return res.render('main/home/home',{
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications: notifications,
    countNotifUnread : countNotifUnread,
    contacts : contacts,
    contactsSent: contactsSent,
    contactsReceived : contactsReceived,
    countAllContacts : countAllContacts,
    countAllContactsSent : countAllContactsSent,
    countAllContactsReceived : countAllContactsReceived,
    allConversations : allConversations,
    userConversations : userConversations,
    groupConversations : groupConversations,
    allConversationWithMessage : allConversationWithMessage,
    bufferToBase64 : bufferToBase64,
    lastItemOfArr : lastItemOfArr,
    convertTimestampToHumanTime : convertTimestampToHumanTime
  });
}

module.exports = homeController;
