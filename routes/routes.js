const express = require('express')
const router = express.Router();
const User = require('../models/users')
const multer = require('multer');
const fs = require('fs')

//image upload
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});

let upload = multer({
    storage:storage
}).single("image");

//Insert a new user to db

router.post('/add',upload,(req,res)=>{
    const {name,email,phone}=req.body;
    const user = new User({
        name:name,
        email:email,
        phone:phone,
        image:req.file.filename
    });
    user.save()
    res.redirect('/');
})

//get all users
router.get('/',async (req,res)=>{
    const users = await User.find();
    res.render("index",{
        title:"Home Page",
        users:users
    })
})

router.get('/add',(req,res)=>{
    res.render('add_users',{title:"Add users"});
})

router.get('/edit/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.redirect('/');
        }
        res.render("edit_users",{title:"Edit Page",user:user})
    }
    catch(e){
        console.log(e);
    }
    
})

//update user

router.post('/update/:id',upload,async(req,res)=>{
    let new_image = '';
    const id= req.params.id;
    if(req.file){
        try{
            new_image = req.file.filename;
            fs.unlinkSync("./uploads/"+req.body.old_image);
        }   
        catch(e){
            console.log(e);
        }
    }
    else{
        new_image  = req.body.old_image;
    }

    const user = await User.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:new_image
    });
    res.redirect('/')
})


router.get('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    const user= await User.findByIdAndDelete(id);
    if(user){
        try{
            fs.unlinkSync('./uploads/'+user);
        }
        catch(e){
            console.log(e);
        }
    }
    res.redirect('/');
})


router.get('/contact',(req,res)=>{
    res.render("contact",{title:"Contact page"})
})

router.get('/about',(req,res)=>{
    res.render("about",{title:"About page"})
})

module.exports=router;