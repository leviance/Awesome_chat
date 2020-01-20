import {validationResult} from 'express-validator/check';
import {auth} from '../sevices/index';

let loginRegister = function(req,res){
  return res.render('auth/master',{
    errors: req.flash('errors'),
    success: req.flash('success')
  });
}

let postRegister = async (req,res) =>{
  let errorsArr = [];
  let successArr = [];
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }
  try {
    let createUserSuccess =  await auth.register(req.body.email, req.body.gender ,req.body.password, req.protocol, req.get('host'));
    successArr.push(createUserSuccess);
    req.flash('success',successArr);
    return res.redirect('/login-register');
  } catch (error) {
    errorsArr.push(error);
    req.flash('errors', errorsArr);
    return res.redirect('/login-register');
  }

};

module.exports = {
  loginRegister : loginRegister,
  postRegister : postRegister
}