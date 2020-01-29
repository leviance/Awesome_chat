import {notification} from '../sevices/index';

let homeController = async (req,res) => {
  let notifications = await notification.getNotifications(req.user._id);
  
  return res.render('main/home/home',{
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications: notifications
  });
}

module.exports = homeController;
