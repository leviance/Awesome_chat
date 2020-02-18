import _ from 'lodash';
import chatGroup from '../models/chatGroup.model';

let addNewGroup = (currentUserId,arrayMemberIds,groupChatName) =>{ 
  return new Promise( async (resolve, reject) =>{
    try {
      arrayMemberIds.unshift({userId : `${currentUserId}`});
      arrayMemberIds = _.uniqBy(arrayMemberIds,"userId");
      
      let newGroupItem = {
        name : groupChatName,
        userAmount : arrayMemberIds.length,
        userId : `${currentUserId}`,
        members : arrayMemberIds
      };

      let newGroup = await chatGroup.createNew(newGroupItem);
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup : addNewGroup
}