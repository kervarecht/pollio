

$(document).ready(function(){
    console.log("jQuery is working.");
});


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  
  var send = {
    'token': id_token,
    'name': profile.getName(),
    'email': profile.getEmail(),
  }
  
  console.log(send);
  
  $.get('/auth/google', send, function(response){
    console.log(response);
  })
}