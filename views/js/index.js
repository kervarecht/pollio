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
           var pollLabels = [];
           var pollVotes = [];
           var title = poll.title;
           var creator = poll.creator;
           
           //Create voting button for each option, title, and display user
           var voteButton = function(title, choice){
               return '<button class="vote-option id="' + title + '" name="' + choice + '">' + choice + '</button>';
           }
           
           var displayTitle = "<h1 class='poll-title'>" + title + "</h1>";
           var displayCreator = "<h2 class='poll-creator'>A poll by: " + creator + "</h2>"
           
           voteOptions.forEach(function(option){
              pollLabels.push(option.optionName);
              pollVotes.push(option.votes);
           });
           //creating each graph from poll object
           var data = {
               labels: pollLabels,
               series: pollVotes
           }
           
                            
            var options = {
                labelInterpolationFnc: function(value) {
                return value[0]
                    },
                    //figure out a way to make charts full size
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
            pollLabels.forEach(function(option){
                $(menuTarget).append(voteButton(title, option))
                
            });
           
           new Chartist.Pie(chartTarget, data, options, responsiveOptions);
            
            
           
            });
           });
            
       });
       
     

  //dynamically send POST request to vote on polls
