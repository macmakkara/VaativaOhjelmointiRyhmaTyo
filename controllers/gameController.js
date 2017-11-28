const moment = require("moment");
const db_controller = require("./db_controller");

module.exports = {


    //lähettää uuden pelin kantaan, palauttaa kyseisen pelin id:n (ns. gametoken jota pelintekijä voi hyödyntää)
    addGame: function (req, res) {

        let uusipeli = {
            "game": req.body.game,
            "timestamp": moment().format("x")
        };

        db_controller.addGame(uusipeli, (virhe, vastaus) => {

            if (virhe) {
                res.status(500).json(virhe);
            } else {
                res.status(200).json(vastaus);
            }

        })
    }
};