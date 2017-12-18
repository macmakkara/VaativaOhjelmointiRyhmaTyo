const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const moment = require("moment");

const routes = require('./routes/routes'); //Sisältää kaikki urlit
const db_controller = require("./controllers/db_controller");
const config_server = require("./configs/server");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./front"));
app.locals.pretty = true;


app.use((req, res, next) => {
    //console.log("app.use!");
    //console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");

    next();
});

app.use('/api/', routes); //Kaikki apin pyynnöt ohjataan routesiin

app.listen(config_server.portti, () => {
    console.log("Palvelin käynnistyi porttiin " + config_server.portti);
});
