var mongo = require('mongodb').MongoClient;

var url = process.env.MONGO_DATABASE;

//Need to create a 'create poll option'
exports.createPoll = function(pollObject){
    mongo.connect(url, function(err, db){
        if (err) throw err;
        
        var collection = db.collection('polls');
    });
}

//Need to create a vote on poll option