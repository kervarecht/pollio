$(document).ready(function(){
   console.log('jQuery working on index.html'); 
   //increment to create new graphs
   var counter = 0;
   //to create further graphs, need to push new elements into the DOM
   var chartistNode = '<div id="chart-' + counter + '" class="ct-chart ct-perfect-fourth"></div>'
   
   //create option buttons for graph options
   var pollButton = function(pollTitle, pollOption){
       return '<button class="poll-option" onclick="vote()" id="' + pollTitle + '" name="' + pollOption + '" >' + pollOption + '</button>';
   };
   
   //Loading 3 poll graphs on load
   $.get('/getpolls', function(result){
       
       //define poll object from server call
       var polls = Array.from(result);
       polls.forEach(function(poll){
           
           //increment counter and track unique DOM node to attach chart to
           counter++;
           var voteOptions = poll.options;
           //Separation of concerns - buttonLabels is used to generate front-end buttons and POST request
           //pollLabels and pollVotes are used to generate values for Chartist
           var buttonLabels = [];
           var pollLabels = [];
           var pollVotes = [];
           var title = poll.title;
           var creator = poll.creator;
           
           //Create voting button for each option, title, and display user
           var voteButton = function(title, choice){
               return '<button onclick="vote()" "class="vote-option" id="' + title + '" name="' + choice + '">' + choice + '</button>';
           }
           
           var displayTitle = "<h1 class='poll-title'>" + title + "</h1>";
           var displayCreator = "<h2 class='poll-creator'>A poll by: " + creator + "</h2>"
           
           voteOptions.forEach(function(option){
              buttonLabels.push(option.optionName);
              pollLabels.push(option.optionName + ": " + option.votes);
              pollVotes.push(option.votes);
           });
           //creating each graph from poll object
           var data = {
               labels: pollLabels,
               series: pollVotes
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
            //target first 3 chart DOM nodes
            var chartTarget = "#chart-" + counter;
            var menuTarget = "#poll-" + counter;
            
            //create a title, display user and vote buttons
            $(menuTarget).append(displayTitle);
            $(menuTarget).append(displayCreator);
            buttonLabels.forEach(function(option){
                $(menuTarget).append(voteButton(title, option))
                
            });
           
           new Chartist.Pie(chartTarget, data, options, responsiveOptions);
            
            
           
            });
           });
            
       });
       
//send POST request to route /vote with information on poll and selection  
function vote() {
    var pollName = event.target.id;
    var optionName = event.target.name;
    $.post('/vote', {
        'poll' : pollName,
        'vote' : optionName
    }, 
    function(data){
        console.log(data);
    });
    $("#" + pollName).parent().append("<p>Voted Successfully!  Poll will update on refresh </p>")
    
}