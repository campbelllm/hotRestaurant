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

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tables", function(req, res) {
//   res.sendFile(path.join(__dirname, "add.html"));
});

app.get("/reservations", function(req, res) {
    let rawData = fs.readFileSync("db.json");
    // console.log(rawData);
    res.send(JSON.parse(rawData));
});

app.post("/reservations", function(req, res) {
    const newReservations = req.body
    let rawData = fs.readFileSync("db.json");
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




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
