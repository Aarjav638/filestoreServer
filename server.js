const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = 3000;

app.use("/aws", require("./routes/awsRoutes"));
app.use("/wasabi", require("./routes/wasabiRoutes"));

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
