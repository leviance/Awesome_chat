import {check} from 'express-validator/check';
import {transValidator} from '../../lang/vi.js';

let register = [
  check("email",transValidator.email_incorrect)
    .isEmail()
    .trim(),
  check("gender",transValidator.gender_incorrect)
    .isIn(["male", "female"]),
  check("password",transValidator.password_incorrect)
    .isLength({min:8})
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/),
  check("password_confirmation",transValidator.password_confirmation_incorrect)
    .custom((value,{req}) =>{
      return value === req.body.password
    })
]

module.exports = {
  register : register
}