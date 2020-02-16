import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let userOnlineOffline = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._doc._id,socket.id);
    //console.log(socket.request.user.chatGroupIds[0]._doc);

    socket.request.user.chatGroupIds.forEach(function(group){
      clients = pushSocketIdToArray(clients,group._doc._id,socket.id);
    });
    let listUsersOnline = Object.keys(clients);
    // Step 01:  emit to user affter login or f5 web page
    socket.emit("server-send-list-users-online",listUsersOnline);

    //  Step 02: emit to another user online
    socket.broadcast.emit('server-send-when-new-user-online',socket.request.user._doc._id);

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._doc._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._doc._id,socket);
      });

      socket.broadcast.emit('server-send-when-new-user-offline',socket.request.user._doc._id);
    });

  });
};

module.exports = userOnlineOffline;