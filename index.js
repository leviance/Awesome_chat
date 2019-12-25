import express from 'express';
let app = express();

app.get('/',function(req,res){
  res.send('Hello world');
});

app.listen(3000,'localhost',function(){
  console.log('khoi chay thanh cong');
});
