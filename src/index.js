import express from 'express';
import connectDB from './config/connectDB';
import conFigViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'; 
import configSession from './config/session'
import passport from 'passport';

let app = express();


// connect to mongodb
connectDB();

// Config session
configSession(app);

// config view engine
conFigViewEngine(app);

// enable post data
app.use(bodyParser.urlencoded({extended : true}));

// enable flash messages
app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());

initRoutes(app);

app.listen(process.env.APP_port,process.env.APP_host,function(){
  console.log('khoi chay thanh cong');
}); 

