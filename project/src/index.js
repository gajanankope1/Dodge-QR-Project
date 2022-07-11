const express = require("express");
const path = require("path")
require("./db/connection");
const usersRouter = require("./routers/users");
const adminRouter = require("./routers/admin");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.join(__dirname,"views"))
app.set("view engine", "hbs");
app.use(usersRouter);
app.use(adminRouter);


app.listen(port, () => {
    console.log("server run uo on port : ", port);
})