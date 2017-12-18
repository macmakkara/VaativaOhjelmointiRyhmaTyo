const moment = require("moment");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;
const config_server = require("../configs/server");

let db_url = "mongodb://" + config_server.dburl; // Siirretty config/server.js

let db;

mongoClient.connect(db_url, (err, yhteys) => {
    if (err) {
        console.log(err);
    } else {
        //console.log(yhteys);
        //console.log("Yhteys tietokantapalvelimeen luotu");
    }
    db = yhteys.db("gamescore");
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
                $unwind: "$game"
            },
            {
                $project: {
                    __v: 0,
                    "gametoken": 0,
                    "game.__v": 0,
                    "game._id": 0,
                    "game.timestamp": 0,
                    "game.gametoken": 0,
                    "_id":0
                }
            }

        ]).toArray((virhe, rivit) => {

            if (virhe) throw virhe;

            callback(virhe, rivit);

        });
    },

    getGameScore: (game_id, callback) => {

        db.collection("scores").find({ "game_id": game_id }, {"gametoken":0 }).toArray((virhe, rivit) => {

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

        db.collection("games").find({ "_id": ObjectId(scoredata.game_id) }).toArray((virhe, rivit) => {
            
            if (rivit.length === 1) {

                if (scoredata.gametoken === rivit[0].gametoken) {

                    db.collection("scores").insertOne(scoredata, (virhe, rivit) => {

                        if (virhe) throw virhe;

                        callback(virhe, rivit);
                    });

                } else {

                    callback("Token ei täsmää, pisteitä ei lisätty", rivit);

                }
            } else {

                callback("Pelin ID ei tästää mihinkään peliin tai ID:llä löytyi useampi peli (Tämän ei pitäisi olla mahdollista)", rivit);
           
            }
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
    
    findPlayerByName: (player, callback) => {

        db.collection("scores").find({ "player": player }).toArray((virhe, rivit) => {
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

        db.collection("games").find({},{"gametoken":0 }).toArray((virhe, rivit) => {
            if (virhe) throw virhe;
            callback(virhe, rivit);
        });
    }

};
