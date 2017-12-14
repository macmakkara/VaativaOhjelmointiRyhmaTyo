const db_controller = require("./db_controller");


module.exports = {

    testconnection: function (req, res) {
        //Tätä voi käyttää clientin puolella testaamaan, onko palvelin käynnissä. Lähinnä sanitycheck tarkoituksissa
        //console.log("yhteyttä testataan osoitteesta:" + req.hostname);
        res.status(200).json("Palvelin on toiminnassa");
    },

    //Debug palikka kannan tyhjentämiseen testidatasta. 
    deleteAllScores: function (req, res) {
        console.log("deleteAllScores");

        db_controller.deleteAllScores((virhe, vastaus) => {
            console.log(virhe);
            console.log(vastaus);

            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä pistedataa: " + virhe);
            } else {
                res.status(200).json("Collection tyhjennetty onnistuneesti");
            }
        })
    },

    deleteAllGames: function (req, res) {
        console.log("deleteAllGames");

        db_controller.deleteAllGames((virhe, vastaus) => {
            console.log(virhe);
            console.log(vastaus);

            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä pelidataa: " + virhe);
            } else {
                res.status(200).json("Collection tyhjennetty onnistuneesti");
            }
        })
    },

    emptyDatabase: function (req, res) {
        console.log("emptyDatabase");

        db_controller.emptyDatabase((virhe, vastaus) => {


            if (virhe) {
                res.status(500).json("Tapahtui virhe tyhjentäessä kantaa: " + virhe);
            } else {
                res.status(200).json("Kanta tyhjennetty onnistuneesti");
            }
        })
    },

    getGameList: function (req, res) {

        console.log("getGameList");

        db_controller.getGameList((virhe, vastaus) => {
            console.log(virhe);
            console.log(vastaus);

            if (virhe) {
                res.status(500).json(virhe);
            } else {
                res.status(200).json(vastaus);
            }
        })


    },



};