import homeController from './homeController'
import authController from './authController'
import userController from './userController';
import contactController from './contactController'; 
import notifController from './notificationController';
import messageController from './messageController';
import groupChat from './groupChatController';


module.exports.home = homeController;
module.exports.auth = authController;
module.exports.user = userController;
module.exports.contact = contactController;
module.exports.notification = notifController;
module.exports.message = messageController;
module.exports.groupChat = groupChat; 
