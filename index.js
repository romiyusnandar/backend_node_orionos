const express = require("express");

const app = express();

const port = 4000;

// route
app.get("/", (req, res) => {
  res.send("Hello, World! 🚀");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});