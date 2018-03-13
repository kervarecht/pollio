var counter = 0;
$(document).ready(function(){
    
   
       $.get('/allmypolls',  function(result){
           var polls = Array.from(result);
           
           result.forEach(function(poll){
               $("#polls-container-all").append(createPollArea(poll));
               createChart(poll, $('.ct-chart').get(counter));
               counter++;
            });
                
    });
});