import NotificationModel from "../models/notification.model";
import UserModel from "../models/user.model";

let getNotifications  =  (currentUserId,limit = 10) => {
  return new Promise( async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,limit);
      // convert notifications sang dang du lieu nhu trong vd
      let notificationsArr = [];
      notifications.forEach((notification)=>{
        notificationsArr.push(notification._doc);
      });
      // end convert notifications sang dang du lieu nhu trong vd
      
      let getNotifContents = notificationsArr.map( async (notification) =>{
        let sender = await UserModel.findUserById(notification.senderId); 
        return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
  getNotifications : getNotifications
};