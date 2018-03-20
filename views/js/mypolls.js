var counter = 0;
$(document).ready(function(){
    
   
       $.get('/allmypolls',  function(result){
           var polls = Array.from(result);
           
           result.forEach(function(poll){
               $("#polls-container-all").append(createPollArea(poll));
               createChart(poll, $('.ct-chart').get(counter));
               counter++;
            });
            
            var totals = createAggregateStats(polls);
            
            $("#stats-div").append(presentStats(totals));
                
    });
});

function createAggregateStats(array){
    var totalPolls = 0;
    var totalVotes = 0;
    var totalOptions = 0;
    
    array.forEach(function(poll){
        totalPolls++;
        for (key in poll.options){
          totalOptions++;
          totalVotes += poll.options[key];
        };
    });
    
    var aggregateObj = {
        'polls': totalPolls,
        'votes': totalVotes,
        'options': totalOptions
    };
    
    return aggregateObj;
    
};

function presentStats(object){
    var polls = object.polls;
    var votes = object.votes;
    var options = object.options;
    var pollP = '<p class="poll-stats">Total Polls: ' + polls + "</p>";
    var optionsP = '<p class="poll-stats">Total Options: ' + options + "</p>";
    var votesP = '<p class="poll-stats">Total Votes: ' + votes + "</p>";
    
    return pollP + optionsP + votesP;
}