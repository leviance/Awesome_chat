import express from 'express';
import {home,auth,user,contact, notification} from '../controllers/index';
import validator from '../validation/authValidation';
import userValid from '../validation/userValidation';
import contactValid from '../validation/contactValidation';
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';
import initPassportGoogle from '../controllers/passportController/google'; 

initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

let initRoutes = (app) =>{
  router.get('/login-register',auth.checkLoggedOut ,auth.loginRegister);
  router.post('/register',auth.checkLoggedOut, validator.register,auth.postRegister);
  router.get('/verify/:token',auth.checkLoggedOut, auth.verifyAccount);
  router.post('/login',auth.checkLoggedOut, passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  router.get('/auth/facebook',auth.checkLoggedOut, passport.authenticate("facebook",{scope : ["email"]}));
  router.get('/auth/facebook/callback',auth.checkLoggedOut, passport.authenticate("facebook",{
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get('/auth/google',auth.checkLoggedOut, passport.authenticate("google",{scope : ["email"]}));
  router.get('/auth/google/callback',auth.checkLoggedOut, passport.authenticate("google",{
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get('/',auth.checkLoggedIn ,home);
  router.get('/logout',auth.checkLoggedIn ,auth.getLogout);

  router.put('/user/update-avatar',auth.checkLoggedIn , user.upDateAvatar );
  router.put('/user/update-infor',auth.checkLoggedIn , userValid.updateInfor ,user.updateInfor );
  router.put('/user/update-password',auth.checkLoggedIn, userValid.updatePassword ,user.updatePassword);

  router.get('/contact/find-users/:keyWord',auth.checkLoggedIn, contactValid.findUserContact , contact.finndUsersContact);
  router.post('/contact/add-new',auth.checkLoggedIn, contact.addNew);
  router.delete('/contact/remove-request-contact',auth.checkLoggedIn, contact.removeRequestContact);

  router.get('/notification/read-more/:skipNumber',auth.checkLoggedIn ,notification.readMore);
  router.put('/notification/mark-all-as-read',auth.checkLoggedIn ,notification.markAllAsRead);
  
  return app.use('/',router);

}

module.exports = initRoutes;