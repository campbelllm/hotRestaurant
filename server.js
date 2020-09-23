// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");

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
app.get("/api/tables", function(req, res) {
    let rawData = fs.readFileSync("model/reservations.json");    
    res.send(JSON.parse(rawData));
});


app.post("/api/waitlist", function(req, res) {
    const newReservations = req.body
    let rawData = fs.readFileSync("mode/waitlist.json");
    let jsonData = JSON.parse(rawData);
    jsonData.push(newReservations)
    fs.writeFileSync('db.json', JSON.stringify(jsonData))
    // console.log(req.body)
    res.json(jsonData)
});

app.delete('/reservations',function(req, res) {
    fs.writeFileSync('db.json', JSON.stringify([]))
    res.send('Deleted')
});

// ************* API ROUTES END ********************************


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
