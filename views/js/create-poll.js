
   
$(document).ready(function(){
   console.log("jQuery working on create-poll");

   var optionCount = 1;
   
   

$("#add-option").on('click', function(){
      var optionHtml = "<p>Option: <input name='option-" + optionCount + "' type=text required><button class='delete' required>Delete</button> </p>";
      $("#options").append(optionHtml);
      console.log("Adding option: " + optionCount);
      optionCount++;
   });
   
   $(document).on('click', '.delete', function(){
      event.preventDefault();
      console.log(event.target.parentElement);
      $(event.target).removeAttr('required');
      event.target.parentElement.remove();
   });  
   
   $("form").submit(function(poll){
      if (optionCount <= 1){
         poll.preventDefault();
         console.log("Add another option");
         alert("Add another option.")
      }
   });
});

