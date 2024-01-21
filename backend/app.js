const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models/dbModel");

const app = express();
const port = 3001;
const informationRoutes = require("./routes/informationRoutes");

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api/", informationRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");

    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });
