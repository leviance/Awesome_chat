import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    email : {type : String , trim : true}
  },
  google: {
    uid : String,
    token :String,
    email : {type : String , trim : true}
  },
  createdAt : {type :Number , default : Date.now},
  updatedAt : {type :Number , default : null},
  removedAt : {type :Number , default : null}
});

usreSchema.statics = {
  createNew(item) {
    return this.create(item);
  }, 
  findByEmail(email) {
    return this.findOne({'local.email' : email}).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      {'local.verifytoken':token},
      {'local.isActive' : true,'local.verifytoken': null}
    ).exec();
  }, 
  findUserById(id) {
    return this.findById(id).exec();
  }, 
  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid" : uid}).exec();
  }
};

usreSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};

module.exports = mongoose.model('user',usreSchema);