const moment = require("moment");
const db_controller = require("./db_controller");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;

module.exports = {

    //lähettää uuden pelin kantaan, palauttaa lisätyn ns. autentikointitiedot
    addGame: function (req, res) {

        if (!req.body.peli_nimi) {

            res.status(400).json("Pelin nimi on pakollinen tieto!");

        } else {

            //Tarkistetaan onko samanniminen peli jo kannassa
            db_controller.findGameByName(req.body.peli_nimi, (virhe_findGameByName, vastaus_findGameByName) => {

                if (virhe_findGameByName) throw virhe_findGameByName;

                if (virhe_findGameByName) {

                    res.status(500).json("Tapahtui virhe tarkistaessa pelin nimen olemassaoloa:" + virhe_findGameByName);

                } else {

                    if (vastaus_findGameByName.length > 0) {

                        res.status(400).json("Samanniminen peli on jo olemassa! Kokeile toista nimeä");

                    } else {

                        let uusipeli = {
                            "peli_nimi": req.body.peli_nimi,
                            "timestamp": moment().format("x"),
                            "gametoken": String(Math.random().toString(36).substr(2) + moment().format("x"))   //Tähän kunnollinen logiikka tilalle, nyt lähinnä "proof of concept" token;
                        };

                        db_controller.addGame(uusipeli, (virhe_addGame, vastaus_addGame) => {

                            if (virhe_addGame) throw virhe_addGame;

                            if (virhe_addGame) {

                                res.status(500).json("Tapahtui virhe lisättäessä peliä. Virhe: " + virhe_addGame);

                            } else {

                                let authData = {
                                    "game_id": vastaus_addGame.ops[0]._id,
                                    "gametoken": vastaus_addGame.ops[0].gametoken
                                };

                                res.status(200).json(authData);
                            }

                        });

                    }
                }

            });

        }

    },

    getGameList: function (req, res) {

        db_controller.getGameList((virhe_getGameList, vastaus_getGameList) => {

            if (virhe_getGameList) throw virhe_getGameList;

            if (virhe_getGameList) {

                res.status(500).json("Tapahtui virhe hakiessa pelien listaa: " + virhe_getGameList);

            } else {

                res.status(200).json(vastaus_getGameList);

            }
        });
    },


    findGameById: function (req, res) {


        if (!ObjectId.isValid(req.params.game_id)) {

            res.status(400).json("game_id ei ole muodollisesti oikea!")

        } else {

            db_controller.findGameById(req.params.game_id, (virhe_findGameById, vastaus_findGameById) => {

                if (virhe_findGameById) {

                    res.status(500).json("Tapahtui virhe haettaessa peliä. Virhe: " + virhe_findGameById);

                } else {

                    if (vastaus_findGameById.length == 0) {

                        res.status(404).json("Peliä ei ole olemassa!")

                    } else {

                        res.status(200).json(vastaus_findGameById);

                    }

                }

            });

        }

    }

};