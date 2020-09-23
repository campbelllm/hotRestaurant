$(".submit").on("click", function(event) {
    event.preventDefault();
    
    // Here we grab the form elements
    var newReservation = {
      name: $("#reserve-name").val().trim(),
      phone: $("#reserve-phone").val().trim(),
      email: $("#reserve-email").val().trim(),    
    };

    console.log(newReservation);

    // This line is the magic. It"s very similar to the standard ajax function we used.
    // Essentially we give it a URL, we give it the object we want to send, then we have a "callback".
    // The callback is the response of the server. In our case, we set up code in api-routes that "returns" true or false
    // depending on if a tables is available or not.

    // POSTING TO /api/tables route
    $.post("/api/tables", newReservation,function(status){
        if(status){
          window.location.href="/thankyou.html"
        }
        else{
          window.location.href="/sorry.html"
        }
    });      

  });
