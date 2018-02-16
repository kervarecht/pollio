//reqs
var express = require('express');
var mongo = require('mongodb').MongoClient;
var session = require('express-session');  //need to learn more about how this works
var cookieParser = require('cookie-parser');
require('dotenv').config();

//passport reqs
var passport = require('passport');
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google');

//handlebars
var exphbs = require('express-handlebars');


//==========EXPRESS=============//
var app = express();

//===========ROUTES==============//