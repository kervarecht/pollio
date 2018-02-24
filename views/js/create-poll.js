$(document).ready(function(){
   console.log("jQuery working on create-poll");
   var optionCount = 3;
   
   $('#add-option').on('click', function(){
      $('#options').append('<span class="option"><input type="text" name="option-' + optionCount + '"><p class="delete">Delete</p></span>');
      optionCount++;
   });
   
   $('.delete').on('click', function(){
      console.log($(this).id);
   });
});