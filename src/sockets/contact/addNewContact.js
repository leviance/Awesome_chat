import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let addNewContact = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._doc._id,socket.id);

    socket.on("add-new-contact",(data) =>{ 
      let currentUser = {
        id: socket.request.user._doc._id,
        username: socket.request.user._doc.username,
        avatar: socket.request.user._doc.avatar,
        address: (socket.request.user._doc.address !== null) ? socket.request.user._doc.address : ""
      };

      // emit notification
      if(clients[data.contactId]){
        emitNotifyToArray(clients,data.contactId,io,'response-add-new-contact',currentUser);
      }
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._doc._id,socket);
    });

  });
};

module.exports = addNewContact;