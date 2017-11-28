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
        db_controller.getGameScore(req.params.game, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json(virhe);
            } else {

                vastaus.sort(function (a, b) {
                    return parseFloat(b.score) - parseFloat(a.score);
                });

                res.status(200).json(vastaus);
            }
        })
    },

    //Hakee tietyn pelaajan kaikkien pelien pisteet, järjestää parhaimman mukaan.
    getPlayerScore: function (req, res) {

        //TODO, virheenhallinta, useammat parametrit jne...
        db_controller.getPlayerScore(req.params.playername, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json(virhe);
            } else {

                vastaus.sort(function (a, b) {
                    return parseFloat(b.score) - parseFloat(a.score);
                });

                res.status(200).json(vastaus);
            }
        })
    },

    //Lisää tietyn pelaajan pisteet kantaan
    addPlayerScore: function (req, res) {

        let pisteet = {
            "game": req.body.game,
            "player": req.body.player,
            "score": req.body.score,
            "gametoken": req.body.gametoken, //TODO
            "timestamp": moment().format("x")
        };

        db_controller.postPlayerScore(pisteet, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json(virhe);
            } else {
                res.status(200).json(vastaus);
            }
        })
    }
};