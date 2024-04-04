const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 2002;
const { userRouter } = require("./src/routes/index");
const connect = require("./src/databases/mongodb");
const checkToken = require("./src/authentication/auththentication");
const cors = require("cors")
// CORS middleware
app.use(cors({origin: true}));
// check token
app.use(checkToken);
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// config view engine
app.set("view engine", "./GenChat-master")
// 
app.use(express.static("./gen-chat"))
// url user
app.use("/users", userRouter);
//
app.listen(port, async () => {
  await connect();
  console.log(`Example app on for port ${port}`);
});
