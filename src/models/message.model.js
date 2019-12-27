import mongoose from ('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
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

module.exports = mongoose.model('message',messageSchema);