//Requirements
var mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var Q = require('q');

//database
var url = process.env.MONGO_DATABASE
//This file will contain the mongo operations for Local Login and Sign Up


/*Two Functions
Login - Takes username and password, checks:
Does username exist?  If no return login fail
Is password right?  Hash via bcryp and compareSync, if yes return login successful and user object

Signup - takes username and password, checks:
Does username exist?  If yes, return signup fail
Store username and password hash via bcrypt 
*/

exports.localLogin = function(username, password){
    var deferred = Q.defer();
    
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
        var collection = db.collection('user-info');
        
        collection.findOne({'username': username})
        .then(function(result){
            console.log(result);
           if (null == result){
               console.log("Username not found")
               deferred.resolve(false); //return false boolean for promise
           } 
           else {
               var hash = result.password //existing password for the profile
               console.log("Username found.")
               
               if (bcrypt.compareSync(password, hash)){
                   deferred.resolve(result) //send the database user object to return to user
                    console.log("User logged in!");
                  
               }
               else {
                   console.log("Authentication failed");
                   deferred.resolve(false) //return false boolean for promise
               }
           }
        });
        db.close();
    });
    return deferred.promise; //return promise either with user object or with false value for login failed
}

exports.localSignup = function(username, password, email){
    var deferred = Q.defer();
    
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
        var collection = db.collection('user-info');
        
        collection.findOne({'username': username})
        .then(function(result){
            if (result !== null){
                //username already exists
                console.log("Username already exists");
                deferred.resolve(false);
            }
            else {
                //hash password
                var hash = bcrypt.hashSync(password, 8);
                
                var user = {
                    'username': username,
                    'password': hash,
                    'email': email
                }
                
                collection.insert(user)
                .then(function(){
                    console.log("User created!");
                    db.close();
                    deferred.resolve(user);
                })
            }
        })
    })
    return deferred.promise;
}


