$(document).ready(function(){
    var titleSearch = {
        'title' : $("#passed-poll").val()
    };
    
   $.get('/getpoll',
   titleSearch,
   function(result){
        $("#polls-container-all").append(createPollArea(result));
        createChart(result, $('.ct-chart').get(0));
   }); 
 
   $('.delete-poll').on('click', function(e){
        
    
        $.post('/deletepoll', titleSearch)
    
   });
});

