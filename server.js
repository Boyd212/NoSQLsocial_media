const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

db.once("open", ()=> {
    console.log(`Server running on port ${PORT}.`);
});

