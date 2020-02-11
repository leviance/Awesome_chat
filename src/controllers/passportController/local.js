import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/user.model';
import {transError,transSuccess} from '../../../lang/vi';

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);
      if(!user) {
        return done(null,false,req.flash('errors', transError.loginFalse));
      }
      if(!user.local.isActive){
        return done(null,false,req.flash('errors', transError.account_not_active));
      }

      let checkPassword = await user.comparePassword(password);
      if(!checkPassword){
        return done(null,false,req.flash('errors', transError.loginFalse));
      }

      return done(null,user, req.flash('success',transSuccess.loginSuccess(user.username)))
    } catch (error) {
      console.log(error);
      return done(null,false,req.flash('errors', transError.server_error));
    }
  }));

  // save user id to session
  passport.serializeUser((user,done) =>{
    done(null,user._id);
  });

  passport.deserializeUser((id, done) =>{
    UserModel.findUserByIdForSessionToUse(id)
      .then(user =>{
        return done(null,user);
      })
      .catch(error =>{
        return done(error,null);
      });
  });
}

module.exports = initPassportLocal;