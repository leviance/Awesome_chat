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
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  }, 
  findUserByIdForSessionToUse(id) {
    return this.findById(id,{"local.password" : 0}).exec();
  }, 
  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid" : uid}).exec();
  },
  findByGoogleUid(uid) {
    return this.findOne({"google.uid" : uid}).exec();
  },
  updateUser(id,item) {
    return this.findByIdAndUpdate(id,item).exec();
  },
  updatePassword(id,hashedPassword) {
    return this.findByIdAndUpdate(id,{"local.password" : hashedPassword}).exec();
  },
  findAllForAddContact(deprecatedUserId, keyWord) {
    return this.find({
      $and: [
        {"_id" : {$nin: deprecatedUserId}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex" : new RegExp(keyWord,"i")}},
          {"local.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"facebook.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"google.email": {"$regex" : new RegExp(keyWord,"i")}}
        ]}
      ]
    },{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  },
  getNormalUserDataById(id) {
    return this.findById(id,{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  },
  findAllToAddGroupChat(friendIds, keyWord) {
    return this.find({
      $and: [
        {"_id" : {$in: friendIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex" : new RegExp(keyWord,"i")}},
          {"local.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"facebook.email": {"$regex" : new RegExp(keyWord,"i")}},
          {"google.email": {"$regex" : new RegExp(keyWord,"i")}}
        ]}
      ]
    },{_id : 1, username : 1 , address : 1, avatar : 1}).exec();
  }
};

usreSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};

module.exports = mongoose.model('user',usreSchema);