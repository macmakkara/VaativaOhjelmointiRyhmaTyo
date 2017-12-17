//Debug palikka
main.service("testService", function ($http) {

    this.sanitycheck = true;

    this.tarkistaPalvelimenTila = function () {
        //console.log("haetaan palvelimen tilaa...");
        return $http({
            url: apiUrl + "testconnection",
            method: "GET"
        })
            .then(function (response) { // success
                console.info("Yhteys palvelimeen ok");
                console.log(response);
                return true;
            })
            .catch(function (response) { // error
                console.warn("EI YHTEYTTÄ PALVELIMEEN");
                console.log(response);
                return false;
            });
    };
});



main.service("mockdataService", function ($http, db_service) {

    //Luo games kannasta aitoa dataa, testauksen helpottamiseksi
    this.luoSatunnainenPistedata = function () {

        return db_service.haePelit().then(function (vastaus) {

            if (vastaus.data.length > 0) {

                let satunnainen_peli = Math.floor(Math.random() * vastaus.data.length);

                var testipelaajat = ["Jaska Jokunen", "Mikko Mallikas", "Toni Terävä", "Tero Testaaja", "+|-|3(1/-\55|(133+5|*3/-\]{|_|53|2/\//-\/\/\3\/\/|+|-|5|*3(|/-\15`//\/\l3()15", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇ‌​ÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜ‌​ÝÞßàáâãäåæçèéêëìíîïð"];

                var pistedata = {
                    "game_id": vastaus.data[satunnainen_peli]._id,
                    "player": testipelaajat[Math.floor(Math.random() * testipelaajat.length)],
                    "score": Math.floor(Math.random() * 9000),
                    "gametoken": vastaus.data[satunnainen_peli].gametoken
                };

                return pistedata;
            }
        });
    };


    this.tyhjennaPisteet = function () {

        console.log("Tyhjennetään kaikki pisteet tietokannasta: scores");
        return $http({
            url: apiUrl + "deleteAllScores/",
            method: "GET"
        })
            .then(function (response) { // success
                console.log("tyhjennys Success!");
                return response;
            })
            .catch(function (response) { // error
                console.warn("tyhjennys FAIL!");
                return response;
            });
    };

    this.tyhjennaKanta = function () {

        console.log("Tyhjennetään koko tietokanta");
        return $http({
            url: apiUrl + "emptyDatabase/",
            method: "GET"
        })
            .then(function (response) { // success
                console.log("tyhjennys Success!");
                return response;
            })
            .catch(function (response) { // error
                console.warn("tyhjennys FAIL!");
                return response;
            });
    };
});


main.service("db_service", function ($http) {

    this.lahetaPisteet = function (pistedata) {
        console.log("lähetetään pisteet");
        return $http({
            url: apiUrl + "addplayerscore",
            method: "POST",
            data: pistedata
        })
            .then(function (response) { // success
                console.log("testipiste Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("testipiste FAIL!");
                console.log(response);
                return response;
            });
    };

    this.haePelaajanPisteet = function (pelaaja_nimi) {
        console.log("haetaan" + pelaaja_nimi + " pisteet....");
        return $http({
            url: apiUrl + "getplayerscore/" + pelaaja_nimi,
            method: "GET"
        })
            .then(function (response) { // success
                console.log("pelaajapisteet Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("pelaajapisteet FAIL!");
                console.log(response);
            });
    };

    this.haePelinPisteet = function (peli_id) {
        console.log("haetaan " + peli_id + " pisteet....");
        return $http({
            url: apiUrl + "getgamescore/" + peli_id,
            method: "GET"
        })
            .then(function (response) { // success
                console.log("pelinpisteet Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("pelinpisteet FAIL!");
                console.log(response);
            });
    };

    this.haeKaikkiPisteet = function () {
        console.log("haetaan kaikkien pelien pisteet....");
        return $http({
            url: apiUrl + "getallscores",
            method: "GET"

        })
            .then(function (response) { // success
                console.log("haeKaikkiPisteet Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("haeKaikkiPisteet FAIL!");
                console.log(response);
            });

    };


    /*
    Tämän pitäisi saada takaisin peli_id, nimi
    - jotta voi listata fronttiin mitä pelejä on kannassa
    - tehdä id:n perusteella jatkotoimenpiteitä (kuten hakea tietyn pelin pistetaulut)
    */

    this.haePelit = function () {
        console.log("haetaan kaikki pelit...");
        return $http({
            url: apiUrl + "getGameList",
            method: "GET"
        })
            .then(function (response) { // success
                console.log("kaikkipelit Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("kaikkipelit FAIL!");
                console.log(response);
            });
    };


    /*
        Tämän pitäisi lisätä uusi peli kantaan:
        - INPUT: pelin selkokielinen nimi
        - OUTPUT: palauttaa uuden lisätyn pelin tokenin (tai virheen, jos sellainen on)
    */
    this.uusiPeli = function (pelidata) {

        console.log("lisätään uusi peli (saa takaisin pelin id:n).");
        return $http({
            url: apiUrl + "addGame",
            method: "POST",
            data: pelidata
        })
            .then(function (response) { // success
                console.log("uusipeli Success!");
                console.log(response);
                return response;
            })
            .catch(function (response) { // error
                console.warn("uusipeli FAIL!");
                console.log(response);
                return response;
            });
    };
});


