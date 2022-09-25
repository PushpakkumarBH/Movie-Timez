const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require("lodash");
const mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
require('dotenv/config');
const app = express();
const http = require('http');
const formidable = require('formidable');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/movieDB");
const welcome = "Welcome to Movie Timez. Select your favourite movie and enjoy watching!";
// comment it down if you are using local database
// mongoose.connect("mongodb+srv://pushpak696:IxPw7a6XroFz1wv0@cluster0.4aydr2o.mongodb.net/movieDB");
// image schema starts here
// ref to image adding code https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/ 
let posts = [];
app.use(bodyParser.json());
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });
var imgModel = require('./model');
const { response } = require('express');
// image schema ends here

const userSchema = new mongoose.Schema ({
    name: String,
    mobilenum: Number,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('home', { items: items, lines: welcome,});
        }
    });
  });

app.get("/header", function(req, res){
    imgModel.find({}, (err, items) => {
        if(err){
            console.log(err);
        } else {
            res.render('header', {items:items});
        }
    });
});

app.get('/signin',function(req,res){
    res.render('signin');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.get('/imagesPage', function(req, res){
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});
app.post('/imagesPage', upload.single('image'), function(req, res, next){
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

app.post("/signin", function(req, res){
    const emailadd = req.body.email;
    const password = req.body.password;
    User.findOne({email: emailadd}, function(err, foundUser){
            if(err){
                console.log(err);
            }else{
                if(foundUser){
                    if(foundUser.password==password){
                        res.redirect("/seatBooking");
                    }
                }
            }
        });
    });

app.post("/register", function(req, res){
    const newUser = new User({
        name: req.body.name,
        mobile: req.body.mobilenum,
        email: req.body.email,
        password: req.body.password

    });
    newUser.save(function(err){
        // if(){
        //     res.sendFile(__dirname + "/seatBooking")
        // } else{
        //     res.sendFile(__dirname + "/signup")
        // }
        if(err){
            console.log(err);
        } else {
            res.redirect('/signin');
        }
    });
});

app.get('/seatBooking',function(req, res){
    res.render('seatBooking');

});
app.post('/seatBooking',function(req, res){
    const seatValue = req.body.name;
    
    console.log(seatValue);
});


app.get("/reviews", function(req, res){
    res.render("reviews");
  });
  
  app.get("/feedback", function(req, res){
    res.render("feedback", {posts:posts});
  });
  

  app.post("/reviews", function(req, res){
    
    const post = {
      email: req.body.postEmail,  
      title: req.body.postTitle,
      content: req.body.postBody
    };
  
    posts.push(post);
    res.redirect("/feedback");
  });
  
  app.get("/posts/:postName", function(req, res){
    const requestedTitle =_.lowerCase(req.params.postName);
  
    posts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);
  
      if (storedTitle === requestedTitle){
        res.render("post", {
          email:post.email,  
          title:post.title,
          content:post.content
        });
      }
    });
  });
  



app.listen(process.env.PORT || 3000, function(){
    console.log('Server has started and running at port 3000');
});
