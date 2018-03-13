//track amount of dynamic polls loaded
var counter = 0;

$(document).ready(function(){
    
   //Loading 3 poll graphs on load
   $.get('/getpollsonload', function(result){
       //define poll object from server call
       var polls = Array.from(result);
        
        result.forEach(function(poll){
               $("#polls-container-all").append(createPollArea(poll));
               createChart(poll, $('.ct-chart').get(counter));
               counter++;
        
            });
                
            });
    
     

});       

//set document to recognize dynamically added content buttons
$(document).on('click', '.add-option-to-poll-button', function(){
    var pollName = event.target.name;
    var target = event.target;
    viewAddOptionInput(target, pollName);
    });

//Send new poll options to back-end via dynamic HTML elements
$(document).on('click', '.submit-new-option-to-poll', function(){
    var element = $(event.target);
    var elementParent = $(event.target.parentElement);
   var poll = element.data('target');
   var option = element.prev().val();
   
   $.post('/add-option', {
       'poll' : poll,
       'option' : option
   }, 
   function(result){
       console.log(result);
       if (result == false){
           elementParent.html("<p class='add-option-failure'> Failed to add option.  Please try again later. <p>");
       }
       else {
           elementParent.html("<p class='add-option-success'> Option Added! </p>");
       }
   }
   )
});
   
//function to load more on scroll
$(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
       // alert("near bottom!");
       }
});