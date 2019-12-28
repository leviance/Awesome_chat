import express from 'express';
import connectDB from './config/connectDB';
import contactModel from './models/contact.model';


let app = express();


// connect to mongodb
connectDB();


app.get('/',async function(req,res){
  try {
    let item = {
      userId : 'duong hoang dung',
      contactId : 'duong hoang dung',
    }
    let contact = await contactModel.createNew(item);
    res.send(contact);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.APP_port,process.env.APP_host,function(){
  console.log('khoi chay thanh cong');
});

