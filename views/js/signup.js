$(document).ready(function(){
   console.log("Signup JS working.");
   
   //stop signup if password is too short
   $("#signup").on('click', function(){
       if ($("#password").val().length < 8){
           alert("Password too short - 8 character minimum.");
           $("#signup").submit(function(event){
               event.preventDefault();
           })
       }
   })
   //stop signup if passwords don't match
   $('#signup').on('click', function(){
       if ($("#password").val() !== $("#password2").val()){
        console.log("Values are not equal");
        $("#signup").submit(function(event){
            console.log("Signup prevented.")
            event.preventDefault();
        });
       }
       
       
   });
   
 
});