import express from 'express';
import {home,auth} from '../controllers/index';
import validator from '../validation/authValidation'
import passport from 'passport';
import initPassportLocal from '../controllers/passportController/local';

initPassportLocal();

let router = express.Router();

let initRoutes = (app) =>{
  router.get('/',home);
  
  router.get('/login-register',auth.loginRegister);
  router.post('/register',validator.register,auth.postRegister);
  router.get('/verify/:token',auth.verifyAccount);

  router.post('/login', passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  return app.use('/',router);

}

module.exports = initRoutes;