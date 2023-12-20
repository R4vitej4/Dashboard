const express = require('express')
const ejs = require('ejs')
const bodyparser = require('body-parser');
const session = require('express-session')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 9000;
require('./db');
const router = require('./routes/routes')

// setting ejs as engine
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
// to use static files like css
app.use(express.static("uploads"));
 
app.use(
    session({
        secret:"mykey",
        saveUninitialized:true,
        resave:false
    })
);

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

//route middleware
app.use("",router);

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})