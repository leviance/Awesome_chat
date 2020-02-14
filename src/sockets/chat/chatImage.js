import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let chatImage = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._doc._id,socket.id);
    //console.log(socket.request.user.chatGroupIds[0]._doc);

    socket.request.user.chatGroupIds.forEach(function(group){
      clients = pushSocketIdToArray(clients,group._doc._id,socket.id);
    });

    socket.on("chat-image",(data) =>{ 
      if(data.groupId){
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._doc._id,
          message : data.message
        };

        // emit notification
        if(clients[data.groupId]){
          emitNotifyToArray(clients,data.groupId,io,'response-chat-image',response);
        }
      }
      if(data.contactId){
        let response = {
          currentUserId: socket.request.user._doc._id,
          message : data.message
        };

        // emit notification
        if(clients[data.contactId]){
          emitNotifyToArray(clients,data.contactId,io,'response-chat-image',response);
        }
      };

    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._doc._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._doc._id,socket);
      });
    });

  });
};

module.exports = chatImage;