import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let usreSchema = new Schema({
  username : String,
  gender : {type : String , default : 'male'},
  phone : {type : String, default : null},
  address : {type : String , default : null},
  avatar : {type : String , default : 'avatar-default.jpg'},
  role : {type : String , default : "user"},
  local : {
    email : {type : String , trim : true},
    password : String,
    isActive : {type : Boolean , default : false},
    verifytoken : String
  },
  facebook: {
    uid : String,
    token :String,
    email : {type : String , trim : true},
  },
  google: {
    uid : String,
    token :String,
    email : {type : String , trim : true},
  },
  createdAt : {type :Number , default : Date.now},
  updatedAt : {type :Number , default : null},
  removedAt : {type :Number , default : null}
});

usreSchema.statics = {
  createNew(item) {
    return this.create(item);
  }, 
  findbyemail(email) {
    return this.findOne({'local.email' : email}).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  }
}


module.exports = mongoose.model('user',usreSchema);