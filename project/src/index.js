const express = require("express");
require("./db/connection");
const usersRouter = require("./routers/users");
const adminRouter = require("./routers/admin");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(usersRouter);
app.use(adminRouter);

app.listen(port, () => {
    console.log("server run uo on port : ", port);
})