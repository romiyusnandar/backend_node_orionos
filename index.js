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
  res.status(200).json({
    success: true,
    message: "OrionOS server is up and running 🚀",
    author: "romi.yusna @ OrionOS Team",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});