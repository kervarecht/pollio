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
           console.log(voteOptions);
           //Separation of concerns - buttonLabels is used to generate front-end buttons and POST request
           //pollLabels and pollVotes are used to generate values for Chartist
           var buttonLabels = [];
           var pollLabels = [];
           var pollVotes = [];
           var title = poll.title;
           var creator = poll.creator;
           
           //parsing object form from MongoDB into buttons, graph labels and graph amounts
           for (key in voteOptions){
               pollLabels.push(key + ": " + voteOptions[key]);
               pollVotes.push(voteOptions[key]);
               buttonLabels.push(key);
           }
           
           
           //Create voting button for each option, title, and display user
           var voteButton = function(title, choice){
               return '<button onclick="vote()" "class="vote-option" id="' + title + '" name="' + choice + '">' + choice + '</button>';
           }
           
           var displayTitle = "<h1 class='poll-title'>" + title + "</h1>";
           var displayCreator = "<h2 class='poll-creator'>A poll by: " + creator + "</h2>"
           
           
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
            
            
        //Define a function where if the user scrolls near the bottom, more polls are loaded (3 at a time)
        $(window).scroll(function(){
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 50){
             //   
            } 
        })
        $(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
       alert("near bottom!");
   }
});
       });
       
//send POST request to route /vote with information on poll and selection  
function vote() {
    var origin = event.target;
    var pollName = event.target.id;
    var optionName = event.target.name;
    $.post('/vote', {
        'poll' : pollName,
        'vote' : optionName
    }, 
    function(data){
      
    }).then(function(result){
        //Need to update this to update the chart in real-time... track down the g/path element and increment it too
        console.log("Result: " + result);
        var buttonParent = "#" + origin.parentElement.id
        //disable and hide vote buttons to prevent multiple voting
        $(buttonParent).append("<p>Voted Successfully!  Poll will update on refresh </p>");
        $(buttonParent + " button").attr('disabled', true).hide();
        
    })
    
}