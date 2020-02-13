import {check} from 'express-validator/check';
import {transValidator} from '../../lang/vi.js';

let checkMessageLength = [
  check("messageVal",transValidator.message_text_emoij_incorrect)
    .isLength({min:1,max: 400})
]

module.exports = {
  checkMessageLength : checkMessageLength
}