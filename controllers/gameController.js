const moment = require("moment");
const db_controller = require("./db_controller");

module.exports = {
    //TODO: Callback helvetin välttämiseksi pitäisi varmaan siirtyä promisen käyttöön.

    //lähettää uuden pelin kantaan, palauttaa kyseisen pelin id:n (ns. gametoken jota pelintekijä voi hyödyntää)
    addGame: function (req, res) {
        //console.log("addGame:");
        //console.log(req.body);

        if (!req.body.peli_nimi) {
            res.status(400).json("Pelin nimi on pakollinen tieto!");

         } else {

            //Tarkistetaan onko peli jo kannassa
            db_controller.findGameByName(req.body.peli_nimi, (virhe, vastaus) => {

                if (virhe) {
                    res.status(500).json("Tapahtui virhe tarkistaessa pelin nimen olemassaoloa:" + virhe);
                } else {

                    if (vastaus.length > 0) {
                        //console.log(vastaus);
                        res.status(400).json("Samanniminen peli on jo olemassa! Kokeile toista nimeä");
                    } else {

                        let uusipeli = {
                            "peli_nimi": req.body.peli_nimi,
                            "timestamp": moment().format("x"),
                            "gametoken": String(Math.random().toString(36).substr(2) + moment().format("x"))   //Tähän kunnollinen logiikka tilalle, nyt lähinnä "proof of concept" token;
                        };

                        db_controller.addGame(uusipeli, (virhe, vastaus) => {

                            if (virhe) {
                                res.status(500).json("Tapahtui virhe lisättäessä peliä. Virhe: " + virhe);
                            } else {
                                //palauttaa tuon aiemmin tehdyn tokenin
                                res.status(200).json(uusipeli.gametoken);
                            }

                        })
                    }
                }

            })
        }
    },


    findGameById: function (req, res) {

        db_controller.findGameById(req.params.game_id, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json("Tapahtui virhe haettaessa peliä. Virhe: " + virhe);
            } else {
                res.status(200).json(vastaus);
            }
        })
    },

};