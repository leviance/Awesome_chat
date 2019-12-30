import express from 'express';
import connectDB from './config/connectDB';
import conFigViewEngine from './config/viewEngine';


let app = express();


// connect to mongodb
connectDB();

// config view engine
conFigViewEngine(app);

app.get('/',function(req,res){
  return res.render('main/master');
});

app.get('/login-register',function(req,res){
  return res.render('auth/loginRegister');
});

app.listen(process.env.APP_port,process.env.APP_host,function(){
  console.log('khoi chay thanh cong');
}); 

