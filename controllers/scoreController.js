const moment = require("moment");
const db_controller = require("./db_controller");

module.exports = {

    //Hakee kaikkien pelien kaikki pisteet (lähinnä debug)
    getAllScores: function (req, res) {

        db_controller.getAllScores((virhe, vastaus) => {

            if (virhe) {
                res.status(500).json(virhe);
            } else {
                res.status(200).json(vastaus);
            }
        })
    },

    //Hakee tietyn pelin kaikki pisteet, järjestää parhaimman mukaan
    getGameScore: function (req, res) {

        //TODO, virheenhallinta, useammat parametrit jne...
        db_controller.getGameScore(req.params.game_id, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json("Tapahtui virhe haettaessa pelin pisteitä: " + virhe);
            } else {

                vastaus.sort(function (a, b) {
                    return parseFloat(b.score) - parseFloat(a.score);
                });

                res.status(200).json(vastaus);
            }
        })
    },

    //Hakee tietyn pelaajan kaikkien pelien pisteet käyttäjänimen perusteella, järjestää parhaimman mukaan.
    getPlayerScore: function (req, res) {

        //TODO, virheenhallinta, useammat parametrit jne...
        db_controller.getPlayerScore(req.params.playername, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json("Tapahtui virhe haettaessa pelaajan:" + req.params.playername + "pisteitä. Yritä hetken kuluttua uudelleen. Virhe:" + +virhe);
            } else {

                vastaus.sort(function (a, b) {
                    return parseFloat(b.score) - parseFloat(a.score);
                });

                res.status(200).json(vastaus);
            }
        })
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
            "gametoken": req.body.gametoken,
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

            pisteet.timestamp = moment().format("x");

            db_controller.postPlayerScore(pisteet, (virhe, vastaus) => {

                if (virhe) {
                    res.status(500).json("Tapahtui virhe lisättäessä pisteitä: " + virhe);
                } else {
                    res.status(200).json("Pisteet lisätty onnistuneesti");
                }
            })
        }
    }
};