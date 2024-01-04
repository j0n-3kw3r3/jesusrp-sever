require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const authRoute = require("./Routes/auth");
const imageRoute = require("./Routes/imageRoute");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require('cors');

mongoose.set("strictQuery", true);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

// Enable CORS for all routes
app.use(cors());
//init middleware

// Increase the payload size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use("/api/auth", authRoute);
app.use("/api/image", imageRoute);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
