const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// importing the module
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const auth = require("./controllers/auth");
const postRouter = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const app = express();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.mongo_uri);
app.use(cors());
app.use(express.json());

// router part
app.get("/", (req, res) => {
	return res.send("working");
});
app.use("/user", userRouter);
app.use("/message", auth, messageRouter);
app.use("/post", postRouter);
app.use("/comment", auth, commentRoute);
const port = process.env.port || 3001;
app.listen(port, () => console.log(`server is listining in port ${port}`));
