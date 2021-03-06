// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");
const { json } = require("body-parser");

// Sets up the Express App
// =============================================================
let app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Routes
// =============================================================

// *************  HTML Routes START ****************************

// Send index.html to the user
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public","index.html"));
});

// Send tables.html to the user
app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "public","tables.html"));
});

// Send reserve.html to the user
app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname,"public", "reserve.html"));
});

// ************* HTML Routes END *******************************


// ************* API ROUTES START *******************************
// GET /api/tables
app.get("/api/tables", function(req, res) {
    let rawData = fs.readFileSync("model/reservations.json");    
    res.send(JSON.parse(rawData));
});

// GET /api/waitlist
app.get("/api/waitlist", function(req, res) {    
    let rawData = fs.readFileSync("model/waitlist.json");
    let jsonData = JSON.parse(rawData);
    res.json(jsonData);
});

// POST /api/tables
app.post("/api/tables", function(req, res) {
  // Data received from the form submit
  let requestData = req.body;
     
  //Get the data from reservations.json
  let rawData = fs.readFileSync("model/reservations.json");  
  let jsonData = JSON.parse(rawData);

  // Check if the reservations.json length is less than 5
  if(jsonData.length < 5 ){
    // Add is to the requests data. Here i make use of the array length property
    requestData.id = jsonData.length+1

    // now add this request data to our jsonData. Remember jsonData is the data from the reservations.json
    jsonData.push(requestData);

    //now save the jsonData back to the file
    //but before saving convert is back to the string using JSON.stringify
    fs.writeFileSync("model/reservations.json", JSON.stringify(jsonData));
    
    //Now send 'true' back to user note to the user :)
    return res.send(true);
    
  }
  else{
    // since our reservation list is full hence we will add the customer to the waitlist.json
    rawData = fs.readFileSync("model/waitlist.json");  
    jsonData = JSON.parse(rawData);

    requestData.id = jsonData.length+1
    jsonData.push(requestData);

    fs.writeFileSync("model/waitlist.json", JSON.stringify(jsonData));
    
    //Now send 'false' back toto the user :)    
    return res.send(false);

  } 
});

// POST /api/clear   THIS is to clear all the data from all the tables i.e reservations.json and waitlist.json
app.post('/api/clear',function(req, res) {
    fs.writeFileSync('model/waitlist.json', JSON.stringify([]));
    fs.writeFileSync("model/reservations.json", JSON.stringify([]));
    res.send('All Clear');
});


// REMOVES 1st customer from tables and add the waitlisted customer to the table
// Returns the waitlisted customer being added to tables.
app.get('/api/serveone',function(req, res) {

  let rawReservationData = fs.readFileSync("model/reservations.json");  
  let jsonReservationData = JSON.parse(rawReservationData);

  let rawWaitData = fs.readFileSync("model/waitlist.json");  
  let jsonWaitData = JSON.parse(rawWaitData);
  
  jsonReservationData.shift();
  let waitingCustomer={};
  if(jsonWaitData.length !== 0){
    waitingCustomer = jsonWaitData.shift();
    waitingCustomer.id= jsonReservationData.length+1;
    jsonReservationData.push(waitingCustomer);
  }
  

  fs.writeFileSync('model/waitlist.json', JSON.stringify(jsonWaitData));
  fs.writeFileSync("model/reservations.json", JSON.stringify(jsonReservationData));
  res.json(waitingCustomer);
});

// ************* API ROUTES END ********************************




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
