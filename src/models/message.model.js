import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender : {
    id : String,
    username : String,
    avatar : String
  },
  receiver : {
    id : String,
    username : String,
    avatar : String
  },
  text : String,
  file : {data : Buffer , contentType : String, fileName : String},
  createdAt : {type : Number , default : Date.now},
  updatedAt : {type : Number , default : null},
  removedAt : {type : Number , default : null}
});

messageSchema.statics = {
  getMessages(senderId,receiverId, limit){
    return this.find({
      $or: [
        {$and:[
          {"senderId" : senderId},
          {"receiverId" : receiverId}
        ]},
        {$and:[
          {"receiverId" : senderId},
          {"senderId" : receiverId}
        ]}
      ]
    }).sort({"createdAt": 1}).limit(limit).exec();
  }
};

const MESSAGES_CONVERSATION_TYPE = {
  PERSONAL : "personal",
  GROUP : "group"
};

const MESSAGES_TYPE = {
  TEXT : "text",
  IMAGE : "image",
  FILE : "file"
};

module.exports = {
  model : mongoose.model('messages',messageSchema),
  conversationType : MESSAGES_CONVERSATION_TYPE,
  messageType : MESSAGES_TYPE
}