const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const db = require("./config/key").mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected...."))
    .catch((err) => console.log(err));
app.use("/", require("./router/User"));
app.use("/profile", require("./router/Profile"));
app.use("/shirt", require("./router/Shirt"));
app.use("/single", require("./router/Single"));
app.use("/card", require("./router/Card"));
app.use("/mp3", require("./router/MusicMp3"));
app.use("/mp4", require("./router/MusicMp4"));
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server Run With Port ${PORT}`));