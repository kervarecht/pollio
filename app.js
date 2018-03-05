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

//poll operations
var pollOps = require('./auth/logic/poll-ops.js')

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
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());


//Session-persisted message middleware - I DON'T UNDERSTAND THIS SPECIFICALLY
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


//serialize and de-serialize
passport.serializeUser(function(user, done){
   console.log("Serializing user " + user.username);
   done(null, user);
});

passport.deserializeUser(function(obj, done){
   console.log("Deserializing user " + obj);
   done(null, obj);
   
});

//FUNCTION VERIFYING IF USER IS LOGGED IN
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/login');
}

//This function logs in a user and, if it's successful, changes the session middleware success and executes the callback function(rendering)
//We are creating new local passport strategies called local-signin and local-signup
passport.use('local-login', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funcs.localLogin(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));
   
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funcs.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

//===========ROUTES==============//
app.get('/', function(req, res){
  
    res.render("index", {user: req.user}); 
  });
  
//logging in local user
app.get('/login', function(req, res){
   res.render("login"); 
});

app.post('/login-user', passport.authenticate('local-login', {
   successRedirect: '/',
   failureRedirect: '/login'
}));

//registering local user
app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup-user', passport.authenticate('local-signup', {
   failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("Logging out " + name);
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

app.get('/create-poll', ensureAuthenticated, function(req, res){
  res.render('create-poll', {user: req.user});
});

app.get('/search', function(req, res){
  res.render('search', {user: req.user});
})

//search poll and return poll object
app.post('/findpoll', function(req, res){
  console.log(req.body.title);
  pollOps.findPoll(req.body.title)
  .then(function(result){
    console.log(result);
  });
  
});

app.post('/new-poll', function(req, res){
   var poll = {
     creator: req.user.username,
     title: req.body.title,
     options: []
   }
   
   
   var optionNum = 1;
   for (const key of Object.keys(req.body)) {
    
    if (key.includes('option')){
      var option = {
        optionName: req.body[key],
        votes: 0
      };
      console.log(req.body[key])
      poll.options.push(option);
      optionNum++;
    }
    pollOps.createPoll(poll);
}
res.redirect('/');
});

app.get('/getpolls', function(req, res){
  pollOps.loadPolls().then(function(result){
    res.send(result);
});
});

app.post('/vote', function(req, res){
  pollOps.vote(req.body.poll, req.body.vote)
  .then(function(result){
    res.send("Vote successful!");
  });
  
});
//==========PORT==============//
var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");