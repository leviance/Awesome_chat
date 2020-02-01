import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";

const LIMIT_NUMBER_TAKEN = 10;

let getNotifications  =  (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT_NUMBER_TAKEN);
      // convert notifications sang dang du lieu nhu trong vd
      let notificationsArr = [];
      notifications.forEach((notification)=>{
        notificationsArr.push(notification._doc);
      });
      // end convert notifications sang dang du lieu nhu trong vd
      
      let getNotifContents = notificationsArr.map( async (notification) =>{
        let sender = await UserModel.getNormalUserDataById(notification.senderId); 
        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  })
};

let countNotifUnread  =  (currentUserId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  })
};

let readMore  =  (currentUserId,skipNumberNotification) => {
  return new Promise( async (resolve, reject) => {
    try {
      let newNotificationsArr = await NotificationModel.model.readMore(currentUserId,skipNumberNotification,LIMIT_NUMBER_TAKEN);
      // convert notifications sang dang du lieu nhu trong vd
      let newNotifications = [];
      newNotificationsArr.forEach(item => {
        newNotifications.push(item._doc);
      })
      // 
      
      let getNotifContents = newNotifications.map( async (notification) =>{
        let sender = await UserModel.getNormalUserDataById(notification.senderId); 
        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
      
    } catch (error) {
      reject(error);
    }
  });
};

let markAllAsRead  =  (currentUserId,targetUsers) => {
  return new Promise( async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId,targetUsers);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  })
};

module.exports = {
  getNotifications : getNotifications,
  countNotifUnread : countNotifUnread,
  readMore : readMore,
  markAllAsRead : markAllAsRead
};