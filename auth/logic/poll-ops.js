var mongo = require('mongodb').MongoClient;
var Q = require('q'); //promises for database operations

var url = process.env.MONGO_DATABASE;

//Function to create poll
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

//Vote on poll option
exports.vote = function(pollTitle, option){
    var deferred = Q.defer();
    
    mongo.connect(url, function(err, db){
       if (err) throw err;
       var voteChoice = "options." + option;
       var collection = db.collection('polls');
       
       collection.update({
           'title': pollTitle,
       }, {
           $inc : {
               [voteChoice] : 1
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

//Retrieve 'x most recent' polls option, 3 by default
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
        
        var searchTitle = {
            'title': pollTitle
        };
        collection.findOne(searchTitle)
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

//Insert option into poll
exports.addOption = function(pollTitle, option){
    var deferred = Q.defer();
    mongo.connect(url, function(err, db){
        if (err) throw err;
        //Need to create objects to inject into Mongo function OUTSIDE of it since
        //cannot use variables as property names in object literals
        //so you write them outside and reference them in the operation
       var documentTitle = {'title': pollTitle};
       var newOption = {}
       newOption["options." + option] = 1;
       var collection = db.collection('polls');
       collection.update(
           documentTitle
       ,
       //update data
            {
                $set : newOption
            }
        )
        .then(function(result){
            if (result == null){
                console.log("Couldn't update");
                return deferred.resolve(false);
            }
            else {
                return deferred.resolve(result);
            }
        })
       db.close();
    });
    return deferred.promise;
}

exports.getNextPoll = function(counter){
    
};


exports.allMyPolls = function(user){
    var deferred = Q.defer();
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
       var collection = db.collection('polls');
       var search = {
           'creator': user
       };
       
       collection.find(search).toArray(function(err, result){
            if (err) throw err;
           if (result == null){
               console.log("Error retrieving all polls");
               deferred.resolve(false);
           } 
           else {
               console.log("Found all results!");
               deferred.resolve(result);
           } 
        });

       db.close();
    });
    return deferred.promise;
};

//delete poll
exports.deletePoll = function(title){
    var deferred = Q.defer()
    
    mongo.connect(url, function(err, db){
       if (err) throw err;
       
       var collection = db.collection('polls');
       
       var searchTitle = {
           'title': title
       };
       collection.remove(searchTitle, function(result){
           if (result == null){
               console.log("Couldn't find poll to delete " + result);
               deferred.resolve(false);
           }
           else {
               console.log("Removed!");
               deferred.resolve(result);
           }
       });
       db.close();
    });
    return deferred.resolve;
}