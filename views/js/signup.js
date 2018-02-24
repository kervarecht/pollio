$(document).ready(function(){
   console.log("Signup JS working.");
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