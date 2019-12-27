import mongoose from ('mongoose');
let Schema = mongoose.Schema;

let contactSchema = new Schema({
  userId : String,
  contactId : String,
  status : {type : Boolean, default : false},
  createdAt : {type : Number , default : Date.now},
  updatedAt : {type : Number , default : null},
  removedAt : {type : Number , default : null}
});

module.exports = mongoose.model('contact',contactSchema);