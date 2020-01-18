import express from 'express';
import {home,auth} from '../controllers/index';
import validator from '../validation/authValidation'

let router = express.Router();

let initRoutes = (app) =>{
  router.get('/',home);
  
  router.get('/login-register',auth.loginRegister);
  router.post('/register',validator.register,auth.postRegister);

  return app.use('/',router);

}

module.exports = initRoutes;