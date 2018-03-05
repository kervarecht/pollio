var mongo = require('mongodb').MongoClient;
var Q = require('q'); //promises for database operations

var url = process.env.MONGO_DATABASE;

//Need to create a 'create poll option'
exports.createPoll = function(pollObject){
    var deferred = Q.defer();
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
        var collection = db.collection('polls');
        
        collection.findOne({'title': pollObject.title})
        .then(function(result){
            if (result !== null){
                console.log("Poll with this title already exists");
                deferred.resolve(false);
            }
            else{
                collection.insert(pollObject)
                .then(function(){
                    console.log("Poll created: " + pollObject.title);
                    db.close();
                    deferred.resolve(pollObject);
                    });
            }
        });
    });
    return deferred.promise;
}

//Need to create a vote on poll option
exports.vote = function(pollTitle, option){
    var deferred = Q.defer();
    
    mongo.connect(url, function(err, db){
       if (err) throw err;
       
       var collection = db.collection('polls');
       
       collection.update({
           'title': pollTitle
       }, {
           $inc : {
               option: 1
           }
       })
       .then(function(result){
        if (result === null){
            console.log("No poll by that title");
            deferred.resolve(false);
        }
        else {
            console.log("Voted!");
            db.close();
            deferred.resolve(result);
        }
       });
    });
    return deferred.promise;
}

//Need to create a retrieve 'x most recent' polls option
exports.loadPolls = function(){
    var deferred = Q.defer();
    
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
        var collection = db.collection('polls');
        
        collection.find().limit(3).sort({$natural:-1}).toArray(function(err, result){
            if (err) throw err;
           if (result == null){
               console.log("Error retrieving polls");
               deferred.resolve(false);
           } 
           else {
               console.log("Found results!");
               deferred.resolve(result);
           } 
        })
        
           
           db.close();
        });

    return deferred.promise;
}

//Retrieve poll by title 
exports.findPoll = function(pollTitle){
    var deferred = Q.defer();
    
    mongo.connect(url, (function(err, db){
        if (err) throw err;
        var collection = db.collection('polls');
        
        collection.findOne({'title': pollTitle})
        .then(function(result){
           if (result == null){
               console.log("No poll with name " + pollTitle + " found.");
               deferred.resolve(false);
           } 
           else {
               console.log("Poll found: " + pollTitle);
               deferred.resolve(result);
           }
           db.close();
        });
    }));
    return deferred.promise;
};