import express from 'express';
import connectDB from './config/connectDB';
import conFigViewEngine from './config/viewEngine';
import initRoutes from './routes/web'

let app = express();


// connect to mongodb
connectDB();

// config view engine
conFigViewEngine(app);

initRoutes(app);

app.listen(process.env.APP_port,process.env.APP_host,function(){
  console.log('khoi chay thanh cong');
}); 

