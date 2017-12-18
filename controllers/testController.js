const db_controller = require("./db_controller");


module.exports = {

    testconnection: function (req, res) {
        //Tätä voi käyttää clientin puolella testaamaan, onko palvelin käynnissä. Lähinnä sanitycheck tarkoituksissa
        res.status(200).json("Palvelin on toiminnassa");
    },

    //Debug palikka kannan tyhjentämiseen testidatasta. 
    deleteAllScores: function (req, res) {
        db_controller.deleteAllScores((virhe, vastaus) => {
            if (virhe) throw virhe;

            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä pistedataa: " + virhe);
            } else {
                res.status(200).json("Collection tyhjennetty onnistuneesti");
            }
        });
    },

    deleteAllGames: function (req, res) {
        db_controller.deleteAllGames((virhe, vastaus) => {
            if (virhe) throw virhe;

            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä pelidataa: " + virhe);
            } else {
                res.status(200).json("Collection tyhjennetty onnistuneesti");
            }
        });
    },

    emptyDatabase: function (req, res) {
        db_controller.emptyDatabase((virhe, vastaus) => {
            if (virhe) throw virhe;

            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä kantaa: " + virhe);
            } else {
                res.status(200).json("Kanta tyhjennetty onnistuneesti");
            }
        });
    }
};