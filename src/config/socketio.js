import passportSocketsIo from 'passport.socketio';

let configSocketIo = (io,cookieParser,sessionStore) => {
  io.use(passportSocketsIo.authorize({
    cookieParser : cookieParser,
    key : process.env.SESSION_KEY,
    secret : process.env.SESSION_SECRET,
    store : sessionStore,
    success : (data,accept) =>{
      if(!data.user.logged_in){
        return accept('Invalid User',false);
      }
      return accept(null,true);
    }
  }));
}

module.exports = configSocketIo;