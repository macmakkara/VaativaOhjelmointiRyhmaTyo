const mysql = require("mysql");
const moment = require("moment");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;


let db_url = "mongodb://localhost:27017/gamescore"; //Pitäisi varmaan siirtää configgiin: server.js?

let db;

mongoClient.connect(db_url, (err, yhteys) => {
    if (err) {
        console.log(err);
    } else {
        //console.log(yhteys);
        //console.log("Yhteys tietokantapalvelimeen luotu");
    }
    db = yhteys;
});

module.exports = {


    getAllScores: (callback) => {

        db.collection("scores").aggregate([
            {
                $lookup:
                    {
                        from: "games",
                        localField: "gametoken",
                        foreignField: "gametoken",
                        as: "game"
                    }
                }, 
                { 
                    $unwind : "$game" 
                },
                {
                    $project: {
                        __v: 0,
                        "game.__v": 0,
                        "game._id": 0,
                        "game.timestamp": 0,
                        "game.gametoken": 0
        }}

            ]).toArray((virhe, rivit) => {

                if (virhe) throw virhe;
                console.log(rivit);
                callback(virhe, rivit);

            });
    },

    getGameScore: (game_id, callback) => {

        db.collection("scores").find({ "game_id": game_id }).toArray((virhe, rivit) => {

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

    deleteAllScores: (callback) => {

        db.collection("scores").remove({}, (virhe, rivit) => {
            if (virhe) throw virhe;

            callback(virhe, rivit);
        });
    },

    deleteAllGames: (callback) => {

        db.collection("games").remove({}, (virhe, rivit) => {
            if (virhe) throw virhe;

            callback(virhe, rivit);
        });
    },
    emptyDatabase: (callback) => {

        db.collection("games").remove({}, (virhe, rivit) => {
            if (virhe) throw virhe;

            db.collection("scores").remove({}, (virhe, rivit) => {
                if (virhe) throw virhe;

                callback(virhe, rivit);
            });
        });
    },


    findGameByName: (gamename, callback) => {

        db.collection("games").find({ "peli_nimi": gamename }).toArray((virhe, rivit) => {
            if (virhe) throw virhe;
            callback(virhe, rivit);
        });

    },

    findGameById: (game_id, callback) => {
        let id = mongodb.ObjectId(game_id);

        db.collection("games").find({ "_id": id }, { "gametoken": 0 }).toArray((virhe, rivit) => {
            if (virhe) throw virhe;
            callback(virhe, rivit);
        });

    },


    addGame: (gamedata, callback) => {

        db.collection("games").insertOne(gamedata, (virhe, rivit) => {

            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },


    getGameList: (callback) => {
        //Palauttaa kaikki tiedot pelistä (MYÖS TOKEN, jemmataan lisäämällä findin parametreihin {"gametoken":0 })
        //Testauksen kannalta jätin näkyviin
        db.collection("games").find({}).toArray((virhe, rivit) => {
            if (virhe) throw virhe;
            callback(virhe, rivit);
        });
    }

};
