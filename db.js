const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,{
    dbName:'crud'
})
.then(()=>{
    console.log(`Connected to Mongo DB`)
})
.catch((e)=>{
    console.log("connection error to db"+ e);
})
