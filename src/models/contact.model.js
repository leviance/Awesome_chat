import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let contactSchema = new Schema({
  userId : String,
  contactId : String,
  status : {type : Boolean, default : false},
  createdAt : {type : Number , default : Date.now},
  updatedAt : {type : Number , default : null},
  removedAt : {type : Number , default : null}
});

contactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findAllByUser(userId) {
    return this.find({
      $or : [
        {userId: userId},
        {contactId : userId}
      ]
    }).exec();
  },
  checkExists(userId,contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId" : contactId}
        ]},
        {$and : [
          {"contactId" : contactId},
          {"userId": userId}
        ]}
      ]
    })
  },

  removeRequestContact(userId, contactId){
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId" : contactId}
      ]
    }).exec();
  }
}

module.exports = mongoose.model('contact',contactSchema);
