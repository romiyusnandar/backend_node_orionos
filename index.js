const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 4000;

// route
app.get("/", (req, res) => {
  res.send("Hello, World! 🚀");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});