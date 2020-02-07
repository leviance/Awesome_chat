import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let chatGroupSchema = new Schema({
  name : String,
  usreAmount : {type : Number , min : 3 , max : 100},
  messageAMount : {type : Number , default : 0},
  userId : String,
  members : [
    {userId : String}
  ],
  createdAt : {type : Number , default : Date.now},
  updatedAt : {type : Number , default : Date.now},
  removedAt : {type : Number , default : null}
});

chatGroupSchema.statics = {
  getChatGroups(userId,limit) {
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}}
    }).sort({"updatedAt": -1}).limit(limit).exec();
  }
};

module.exports = mongoose.model('chat-groups',chatGroupSchema);