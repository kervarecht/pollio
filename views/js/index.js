$(document).ready(function(){
    //count dynamic loads
    var counter = 0;
   //Loading 3 poll graphs on load
   $.get('/getpollsonload', function(result){
       console.log(result);
       //define poll object from server call
       var polls = Array.from(result);
        
        result.forEach(function(poll){
               $("#polls-container-all").append(createPollArea(poll));
               createChart(poll, $('.ct-chart').get(counter));
               counter++;
        
            });
            
            
       });
});       
//send POST request to route /vote with information on poll and selection  
function vote() {
    var origin = event.target;
    var pollName = $(event.target).data('pollname');
    var optionName = $(event.target).data('vote');
    $.post('/vote', {
        'poll' : pollName,
        'vote' : optionName
    }, 
    function(data){
      
    }).then(function(result){
        //Need to update this to update the chart in real-time... track down the g/path element and increment it too
        console.log("Result: " + result);
        var buttonParent = $(origin.parentElement)
        //disable and hide vote buttons to prevent multiple voting
        buttonParent.html("<p>Voted Successfully!  Poll will update on refresh </p>");
        
        
    })
    
}

//Create chart/header/options components to integrate into dynamically created poll divs


/*Chartist Settings

//given a poll object, takes data


//creating pieChart
*/

//creating chart area
function createPollArea(poll){
            var voteOptions = poll.options;
            var buttonLabels = [];
            var title = poll.title;
            var creator = poll.creator;
            
            
           //the poll object passed to the function will have title, creator and multiple option pairs
           //pollLabels and pollVotes are used to generate values for Chartist
            console.log(poll);
           
           
           //parsing object form from MongoDB into buttons, graph labels and graph amounts
           for (key in voteOptions){
               buttonLabels.push(displayPollButton(title, key));
           }
           
           //create Header Div from a creator and title div
            var titleDiv = createPollHeaderType('poll-title', title);
            var creatorDiv = createPollHeaderType('poll-creator', creator);
            var headerDiv = createPollHeaderType('poll-header', titleDiv + creatorDiv);
            
            //create Options Div
            var pollOptionsDiv = createPollHeaderType('poll-options-div', buttonLabels.join(""));
            var addOptionToPollDiv = createPollHeaderType('add-option-to-poll', addOptionButton(title));
            var optionDiv = createPollHeaderType('poll-options-container', pollOptionsDiv + addOptionToPollDiv);
            //chart target
            var chartTarget = '<div id="' + title + '" + class="chart-container ct-chart"></div>' 
            
           //concatenate overall structure and return
           var pollContainer = createPollHeaderType('poll-container', headerDiv + optionDiv + chartTarget);
           return pollContainer;
           
}

function createChart(poll, target){
    var voteOptions = poll.options;
    var chartLabels = [];
    var chartVotes = [];
    
    for (key in voteOptions){
               chartLabels.push(key + ": " + voteOptions[key]);
               chartVotes.push(voteOptions[key]);
           }
            
    var data = {
               labels: chartLabels,
               series: chartVotes
           }
           

//setting chart size                
            var options = {
                labelInterpolationFnc: function(value) {
                return value[0]
                    },
                    width: "100%",
                    height: "100%"
            };
            
            var responsiveOptions = [
                ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 50,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value) {
                return value;
                    }
              }],
              ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
              }],
              
            ];

//define a target to insert into
new Chartist.Pie(target, data, options, responsiveOptions);                
};
//voting button
var voteButton = function(title, choice){
               return '<button onclick="vote()" "class="vote-option" data-pollname="' + title + '" name="' + choice + '">' + choice + '</button>';
           }
 
var createPollHeaderType = function(headerClass, content){
    if (headerClass == null){
        return false;
    }
    if (content == null){
        content = "";
    }
    return '<div class="' + headerClass + '">' + content + "</div>"
}

//create title header
var displayTitle = function(title){
    return "<h1 class='poll-title'>" + title + "</h1>";
}
//create creator header
var displayCreator = function(creator){
    return "<h2 class='poll-creator'>A poll by: " + creator + "</h2>"
}       

var displayPollButton = function(title, option){
       return '<button class="poll-option" data-pollname="' + title + '" data-vote="' + option + '" onclick="vote()">' + option + '</button>';
   };

var addOptionButton = function(poll){
    return '<button class="add-option-to-poll-button" name="' + poll + '" onclick="addOption()">Click to Add Option</button>';
}
   
//create add option button for polls if user logged in
//Check if user is logged in, hide add-option button, insert form
function addOption(){
    var optionText = "<p>Type a new option and press submit</p>"
    var optionForm = '<form method="post" action="/add-option"><input type="hidden" name="poll" value="' + event.target.id + '"><input type="text" class="option-input" name="option"><input type="submit"></form>';
    var targetNode = "#" + event.target.parentElement.id;
    
    $.get('/checklogin', function(data){
        if (data){
            $(targetNode).closest('div').html(optionText + optionForm);
        }
        else {
            alert("Please log in to use this function");
        }
    });
}
   
//function to load more on scroll
$(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
       // alert("near bottom!");
       }
});