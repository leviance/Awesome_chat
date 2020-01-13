import express from 'express';
import {home,auth} from '../controllers/index'

let router = express.Router();

let initRoutes = (app) =>{
  router.get('/',home);
  
  router.get('/login-register',auth);

  return app.use('/',router);

}

module.exports = initRoutes;