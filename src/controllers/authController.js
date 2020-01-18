import {validationResult} from 'express-validator/check';

let loginRegister = function(req,res){
  return res.render('auth/master');
}

let postRegister = (req,res) =>{
  let errorsArr = [];
  if(!validationResult(req).isEmpty()){
   let validatorError = Object.values(validationResult(req).mapped());

    validatorError.forEach(validatorError => {
      errorsArr.push(validatorError.msg);
    });
    
    console.log(errorsArr);
    return;
  }
  console.log(req.body);

}

module.exports = {
  loginRegister : loginRegister,
  postRegister : postRegister
}