const mysql = require("mysql");
const moment = require("moment");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;


let db_url = "mongodb://localhost:27017/gamescore"; //Pitäisi varmaan siirtää configgiin: server.js?

let db;

mongoClient.connect(db_url, (err, yhteys) => {
    console.log(err);
    console.log(yhteys);
    console.log("Yhteys tietokantapalvelimeen luotu");

    db = yhteys;
});

module.exports = {
    
    
    getAllScores: (callback) => {

        db.collection("scores").find().toArray((virhe, rivit) => {
            
            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },

    getGameScore: (gamename, callback) => {

        db.collection("scores").find({ "game": gamename }).limit(10).toArray((virhe, rivit) => {

            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },

    getPlayerScore: (playername, callback) => {

        db.collection("scores").find({ "player": playername }).toArray((virhe, rivit) => {

            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },

    postPlayerScore: (scoredata, callback) => {

        db.collection("scores").insertOne(scoredata, (virhe, rivit) => {
            
            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },



    addGame: (gamedata, callback) => {

        db.collection("scores").insertOne(gamedata, (virhe, rivit) => {
            let peli_id = mongodb.ObjectId(rivit.ops[0]._id);

            if (virhe) throw virhe;

            callback(virhe, peli_id);

        });
    },

}
