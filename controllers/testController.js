
module.exports = {

    testconnection: function (req, res) {
        //Tätä voi käyttää clientin puolella testaamaan, onko palvelin käynnissä. Lähinnä sanitycheck tarkoituksissa
        console.log("yhteyttä testataan osoitteesta:" + req.hostname);
        res.status(200).json("Palvelin on toiminnassa");

    }



};