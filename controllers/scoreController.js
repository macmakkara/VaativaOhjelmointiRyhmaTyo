const moment = require("moment");
const db_controller = require("./db_controller");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;

module.exports = {

    getAllScores: function (req, res) {

        db_controller.getAllScores((virhe, vastaus) => {
            if (virhe) throw virhe;

            if (virhe) {
                res.status(500).json(virhe);
            } else {
                res.status(200).json(vastaus);
            }
        });
    },

    //Hakee tietyn pelin kaikki pisteet, järjestää parhaimman mukaan
    getGameScore: function (req, res) {

        if (!ObjectId.isValid(req.params.game_id)) {

            res.status(400).json("game_id ei ole muodollisesti oikea!")

        } else {

            db_controller.findGameById(req.params.game_id, (virhe_findGameById, vastaus_findGameById) => {

                if (virhe_findGameById) throw virhe_findGameById;

                if (vastaus_findGameById.length == 0) {

                    res.status(404).json("Peliä ei löytynyt!");

                } else {

                    db_controller.getGameScore(req.params.game_id, (virhe, vastaus) => {

                        if (virhe) {

                            res.status(500).json("Tapahtui virhe haettaessa pelin pisteitä: " + virhe);

                        } else {

                            vastaus.sort(function (a, b) {
                                return parseFloat(b.score) - parseFloat(a.score);
                            });

                            res.status(200).json(vastaus);
                        }
                    });
                }
            })
        }
    },

    //Hakee tietyn pelaajan kaikkien pelien pisteet käyttäjänimen perusteella, järjestää parhaimman mukaan.
    //Optional parametrina voi antaa pelaajanimen lisäksi game_id:n, jos haluaa tietyn pelaajan ja tietyn pelin pisteet
    getPlayerScore: function (req, res) {

        db_controller.findPlayerByName(req.params.playername, (virhe_findPlayerByName, vastaus_findPlayerByName) => {

            if (virhe_findPlayerByName) throw virhe_findPlayerByName;

            if (vastaus_findPlayerByName.length == 0) {

                res.status(404).json("Pelaajaa ei ole olemassa!");

            } else {

                if (req.params.game_id) {

                    if (!ObjectId.isValid(req.params.game_id)) {

                        res.status(400).json("game_id ei ole muodollisesti oikea!")
                        return; //Horrible hack, jotta ei herjaa "cant set headers after they are sent"

                    }
                }

                db_controller.getPlayerScore(req.params.playername, req.params.game_id, (virhe, vastaus) => {

                    if (virhe) {

                        res.status(500).json("Tapahtui virhe haettaessa pelaajan:" + req.params.playername + "pisteitä. Yritä hetken kuluttua uudelleen. Virhe:" + +virhe);

                    } else {

                        vastaus.sort(function (a, b) { return parseFloat(b.score) - parseFloat(a.score); });

                        res.status(200).json(vastaus);
                    }

                });

            }

        });

    },

    //Lisää tietyn pelaajan pisteet kantaan
    /*
    INPUT:
    {
        "game_id":(Games kannan object_id)
        "player": (pelaajan nimi),
        "score": (pelaajan pisteet kyseisessä pelissä),
        "gametoken":(autentikointitoken, jotta kuka tahansa ei voi puskea dataa kantaan)
    }
    */
    
    addPlayerScore: function (req, res) {

        let pisteet = {
            "game_id": req.body.game_id,
            "player": req.body.player,
            "score": req.body.score,
            "gametoken": req.body.gametoken
        };

        //Horrible hack. Tiettyjen kenttien validointiin luulisi olevan dynaamisempi ja lyhyempikin keino
        if (!pisteet.game_id) {
            res.status(400).json("game_id on pakollinen kenttä");
        } else if (!pisteet.player) {
            res.status(400).json("player on pakollinen kenttä");
        } else if (!pisteet.score) {
            res.status(400).json("score on pakollinen kenttä");
        } else if (!pisteet.gametoken) {
            res.status(400).json("gametoken on pakollinen kenttä");
        } else {

            if (!ObjectId.isValid(req.body.game_id)) {
                res.status(400).json("game_id ei ole muodollisesti oikea!")
            } else if (isNaN(pisteet.score)) {
                res.status(400).json("score ei ole validi numero");
            } else {

                pisteet.timestamp = moment().format("x");

                db_controller.postPlayerScore(pisteet, (virhe, vastaus) => {

                    if (virhe) {

                        res.status(400).json("Tapahtui virhe lisättäessä pisteitä: " + virhe);

                    } else {

                        res.status(200).json("Pisteet lisätty onnistuneesti");

                    }

                });

            }

        }

    }

};