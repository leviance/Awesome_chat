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
  },

  getChatGroupById(id){
    return this.findById(id).exec();
  },

  updateWhenAddNewMessage(id,newMessageAmount){
    return this.findByIdAndUpdate(id,{
      "messageAMount" : newMessageAmount,
      "updatedAt" : Date.now()
    }).exec();
  },

  getChatGroupIdsByUser(userId){
    return this.find({
      "members" : {$elemMatch : {"userId" : userId}}
    },{_id: 1}).exec();
  }
};

module.exports = mongoose.model('chat-groups',chatGroupSchema);