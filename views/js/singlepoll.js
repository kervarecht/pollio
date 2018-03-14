$(document).ready(function(){
    //single poll title is passed into the handlebars template into a hidden input
    var titleSearch = {
        'title' : $("#passed-poll").val()
    };
    
   $.get('/getpoll',
   titleSearch,
   function(result){
        $("#polls-container-all").append(createPollArea(result));
        createChart(result, $('.ct-chart').get(0));
   });
    
});