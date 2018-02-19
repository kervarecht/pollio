//reqs
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var session = require('express-session');  //need to learn more about how this works
var cookieParser = require('cookie-parser');
require('dotenv').config();
var bodyParser = require("body-parser");

//passport reqs
var passport = require('passport');
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google');

//express handlebars
var exphbs = require('express-handlebars');
var hbs = exphbs.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//=========STATIC FILES=========//
app.use(express.static(__dirname + "/auth"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

//==========EXPRESS=============//
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//=========PASSPORT===========//
var funcs = require('./auth/logic/log-ops.js'); //import funcs.localLogin and funcs.LocalSignup
var auth = require('./auth/logic/auth.js');  //import session verification
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

//===========ROUTES==============//
app.get('/', function(req, res){
   res.render("index", {user: req.username}); 
});
//logging in local user
app.get('/login', function(req, res){
   res.render("login"); 
});

app.post('/login-user', function(req, res){
   var request = {
      'username' : req.body.username,
      'password' : req.body.password
   };
   
   funcs.localLogin(req.body.username, req.body.password);
   //username is user1, password is hash for MongoDB test login
   
});

//registering local user
app.get('/signup', function(req, res){
   res.render('signup');
});

//==========PORT==============//
var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");