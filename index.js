const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 4000;

// route
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "OrionOS server is up and running 🚀",
    author: "romi.yusna @ OrionOS Team",
  });
});

app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});