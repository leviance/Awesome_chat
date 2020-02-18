import {check} from 'express-validator/check';
import {transValidator} from '../../lang/vi.js';

let addNewGroup = [
  check("arrayIds",transValidator.add_new_group_users_incorrect)
    .custom((value)=>{
      if(!Array.isArray(value)){
        return false;
      }
      if(value.length < 2){
        return false;
      }
      return true;
    }),
  check("groupChatName",transValidator.add_new_group_name_incorrect)
    .isLength({min:5,max: 30})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];

module.exports = {
  addNewGroup : addNewGroup
}