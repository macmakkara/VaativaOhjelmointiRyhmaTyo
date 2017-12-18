const expect = require("chai").expect;
const request = require("request");
const http = require('http');
const serverConfig = require("../configs/server")
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;

var ip = require("ip");
const apiUrl = "http://" + ip.address() + ":" + serverConfig.portti + "/api/";
var palvelin = require('../main');


before(done => {
    console.log("---------------------------------------");
    console.log("Ennen testien ajoa tehtävät funktiot...");
    console.log("---------------------------------------");

    palvelin.listen(serverConfig.portti, done());

});

after(done => {
    console.log("---------------------------------------");
    console.log("Testien jälkeen ajettavat funktiot...");
    console.log("---------------------------------------");
    request(apiUrl + "emptyDatabase", function (error, response, body) {
        done();
    });
});


//Testeissä käytettävät validit syötteet
//Osa arvoista muuttuu testien aikana (game_id ja token on pakko saada kannasta)

var peli_1 = {
    "peli_nimi": "Blinkenlights - Mocha Explosion"
};

var peli_2 = {
    "peli_nimi": "<>#%{}|\^~[];/?:@=&"
};

var peli_3 = {
    "peli_nimi": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇ‌​ÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜ‌​ÝÞßàáâãäåæçèéêëìíîïð"
};

var pistedata_1 = {
    "game_id": "",
    "player": "ToniTheTestiPelaaja",
    "score": 6666,
    "gametoken": "",
};

var pistedata_2 = {
    "game_id": "",
    "player": "JaskaThePlayerTwo",
    "score": 9001,
    "gametoken": "",
};


describe("geneeriset testit (onko serveri päällä)", function () {

    let url = apiUrl + "testconnection";

    describe("testconnection", function () {

        it("Palauttaa statuskoodin 200 OK", function (done) {
            request(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

    });

});

describe("INTEGRATION", function () {
    describe("POST - addgame", function () {

        let url = apiUrl + "addgame";

        describe("Ei parametreja", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, {}, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Parametri peli_nimi on tyhjä merkkijono", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, { "peli_nimi": "" }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pelin lisäys: " + peli_1.peli_nimi, function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.post(url, { json: peli_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    peli_1 = body;
                    done();
                });
            });

            it("Ei palauta null", function (done) {
                request.post(url, { json: peli_1 }, function (error, response, body) {
                    expect(body).to.not.equal(null);
                    done();
                });
            });

            it("Palauttaa merkkijonon", function (done) {
                request.post(url, { json: peli_1 }, function (error, response, body) {
                    expect(body).to.be.an("string");
                    done();
                });
            });

            it("Ei palauta tyhjää merkkijonoa", function (done) {
                request.post(url, { json: peli_1 }, function (error, response, body) {
                    expect(body).to.not.equal("");
                    done();
                });
            });
        });

        describe("Olemassaolevan pelin lisäys: " + peli_1.peli_nimi, function () {
            it("Palauttaa statuskoodin 400 Bad Request ", function (done) {
                request.post(url, { json: peli_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Toisen pelin lisäys: " + peli_2.peli_nimi, function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.post(url, { json: peli_2 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    peli_2 = body;
                    done();
                });
            });

            it("Ei palauta null", function (done) {
                request.post(url, { json: peli_2 }, function (error, response, body) {
                    expect(body).to.not.equal(null);
                    done();
                });
            });

            it("Palauttaa merkkijonon", function (done) {
                request.post(url, { json: peli_2 }, function (error, response, body) {
                    expect(body).to.be.an("string");
                    done();
                });
            });

            it("Ei palauta tyhjää merkkijonoa", function (done) {
                request.post(url, { json: peli_2 }, function (error, response, body) {
                    expect(body).to.not.equal("");
                    done();
                });
            });


        });

        describe("Kolmannen pelin lisäys: " + peli_3.peli_nimi, function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.post(url, { json: peli_3 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    peli_3 = body;
                    done();
                });
            });

            it("Ei palauta null", function (done) {
                request.post(url, { json: peli_3 }, function (error, response, body) {
                    expect(body).to.not.equal(null);
                    done();
                });
            });

            it("Palauttaa merkkijonon", function (done) {
                request.post(url, { json: peli_3 }, function (error, response, body) {
                    expect(body).to.be.an("string");
                    done();
                });
            });

            it("Ei palauta tyhjää merkkijonoa", function (done) {
                request.post(url, { json: peli_3 }, function (error, response, body) {
                    expect(body).to.not.equal("");
                    done();
                });
            });

        });

    });



    describe("POST - addPlayerScore", function () {

        let url = apiUrl + "addplayerscore";

        describe("Ei parametreja", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, {}, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Parametri game_id on tyhjä merkkijono", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, { "game_id": "" }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Parametri player on tyhjä merkkijono", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, { "player": "" }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Parametri score on tyhjä merkkijono", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, { "score": "" }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Parametri gametoken on tyhjä merkkijono", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.post(url, { "gametoken": "" }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " valideilla parametreilla (pistedata_1)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                pistedata_1.game_id = peli_1.game_id;
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = 1000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " valideilla parametreilla (pistedata_2)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                pistedata_2.game_id = peli_1.game_id;
                pistedata_2.gametoken = peli_1.gametoken;

                request.post(url, { json: pistedata_2 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin: " + peli_2.peli_nimi + " valideilla parametreilla", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                pistedata_1.game_id = peli_2.game_id;
                pistedata_1.gametoken = peli_2.gametoken;
                pistedata_1.score = 2000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });


        describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + ", "+ peli_2.peli_nimi + "id:llä (peli_1 token)", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = peli_2.game_id;
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = 4000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " pelin " + peli_2.peli_nimi + " tokenilla (peli_1 id, peli_2 token)", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = peli_1.game_id;
                pistedata_1.gametoken = peli_2.gametoken;
                pistedata_1.score = 5000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " pelin " + peli_2.peli_nimi + " id:llä (peli_2 token, peli_1 id)", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = peli_2.game_id;
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = 6000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin " + peli_1.peli_nimi + " muodollisesti virheellisellä id:llä, oikea token", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = "123abc";
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = 7000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });

        describe("Pisteiden lisäys peliin " + peli_1.peli_nimi + " muodollisesti virheellisellä tokenilla, oikea id", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = peli_1.game_id;
                pistedata_1.gametoken = "123abc";
                pistedata_1.score = 8000;

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });

        });

        describe("Pisteiden lisäys peliin " + peli_1.peli_nimi + ": pistemäärä virheellinen", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                pistedata_1.game_id = peli_1.game_id;
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = "abc123";

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });

        });

        describe("Pisteiden lisäys peliin " + peli_1.peli_nimi + ": pistemäärä string (mutta yhä numero)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                pistedata_1.game_id = peli_1.game_id;
                pistedata_1.gametoken = peli_1.gametoken;
                pistedata_1.score = "9001";

                request.post(url, { json: pistedata_1 }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

        });
    });


    describe("GET - getallscores", function () {

        let url = apiUrl + "getallscores";

        describe("Palauttaa testidatan", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa neljät pisteet", function (done) {
                request.get(url, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(4);
                    done();
                });
            });

        });

    });

    describe("GET - getgamescore", function () {

        let url = apiUrl + "getgamescore/"

        describe("Palauttaa ensimmäisen pelin pisteet (3 kenttää)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + peli_1.game_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa tasan kolmet pisteet", function (done) {
                request.get(url + peli_1.game_id, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(3);
                    done();
                });
            });
        });

        describe("Palauttaa toisen pelin pisteet (1 kenttä)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + peli_2.game_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("Palauttaa tasan yhdet pisteet", function (done) {
                request.get(url + peli_2.game_id, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(1);
                    done();
                });
            });
        });

        describe("Palauttaa kolmannen pelin pisteet (0 kenttää)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + peli_3.game_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa 0 kenttää", function (done) {
                request.get(url + peli_3.game_id, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(0);
                    done();
                });
            });
        });

        describe("Palauttaa virheen (peli_id ei ole muodollisesti oikea)", function () {
            it("Palauttaa statuskoodin 400 Bad Request", function (done) {
                request.get(url + 'abc123', function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });

        });

        describe("Palauttaa 404 (peli_id:tä ei ole olemassa)", function () {
            it("Palauttaa statuskoodin 404 Not Found", function (done) {
                let testi_id = ObjectId.ObjectID();
                request.get(url + testi_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });

        });
    });




    describe("GET - getplayerscore", function () {

        let url = apiUrl + "getplayerscore/";

        describe("Palauttaa pistedata_1 pelaajan pisteet (3 kenttää)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + pistedata_1.player, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa tasan kolmet pisteet", function (done) {
                request.get(url + pistedata_1.player, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(3);
                    done();
                });
            });
        });

        describe("Palauttaa pistedata_2 pelaajan pisteet (1 kenttä)", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + pistedata_2.player, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa tasan yhdet pisteet", function (done) {
                request.get(url + pistedata_2.player, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(1);
                    done();
                });
            }); 
        });

        it("Palauttaa statuskoodin 200 OK (pelaajan 1 pisteet pelistä 1)", function (done) {
            request.get(url + pistedata_1.player +"/"+ peli_1.game_id, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("Palauttaa pelaajan 1 pisteet pelistä 1 (2 kenttää)", function (done) {
            request.get(url + pistedata_1.player +"/"+ peli_1.game_id, function (error, response, body) {
                expect(JSON.parse(body).length).to.equal(2);
                done();
            });
        });

        it("Palauttaa pelaajan 1 pisteet pelistä 2 (1 kenttä)", function (done) {
            request.get(url + pistedata_1.player +"/"+ peli_2.game_id, function (error, response, body) {
                expect(JSON.parse(body).length).to.equal(1);
                done();
            });
        });

        it("Palauttaa statuskoodin 400 (pelaaja oikein, game_id muodollisesti väärin)", function (done) {
            request.get(url + pistedata_1.player +"/abc123", function (error, response, body) {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });

        describe("Palauttaa 404 (pelaajaa ei ole olemassa)", function () {
            it("Palauttaa statuskoodin 404 Not Found", function (done) {
                request.get(url + "MochaMasterTheTestKiller", function (error, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });

            it("Palauttaa merkkijonon (pelaajaa ei ole olemassa)", function (done) {
                request.get(url + "MochaMasterTheTestKiller", function (error, response, body) {
                    expect(body).to.be.an("string");
                    done();
                });
            });
        });


    });


    describe("GET - getGameList", function () {

        let url = apiUrl + "getGameList";

        describe("Palauttaa pelien listan", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa tasan kolme peliä", function (done) {
                request.get(url, function (error, response, body) {
                    expect(JSON.parse(body).length).to.equal(3);
                    done();
                });
            });

        });

    });




    describe("GET - getGameById", function () {

        let url = apiUrl + "getGameById/"

        describe("Palauttaa peli_1 tiedot", function () {
            it("Palauttaa statuskoodin 200 OK", function (done) {
                request.get(url + peli_1.game_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });

            it("Palauttaa oikean id:n", function (done) {
                request.get(url + peli_1.game_id, function (error, response, body) {
                    expect(JSON.parse(body)[0]._id).to.equal(peli_1.game_id);
                    done();
                });
            });

            it("Palauttaa oikean nimen", function (done) {
                request.get(url + peli_1.game_id, function (error, response, body) {
                    expect(JSON.parse(body)[0].peli_nimi).to.equal("Blinkenlights - Mocha Explosion");
                    done();
                });
            });
        });

        describe("Palauttaa statuskoodin 404 Not Found (id:tä ei ole olemassa)", function () {
            it("Palauttaa statuskoodin 404 Not Found", function (done) {
                let testi_id = ObjectId.ObjectID();
                request.get(url + testi_id, function (error, response, body) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
            });

            it("Palauttaa virheen(id muodollisesti virheellinen)", function (done) {
                request.get(url + "abc123", function (error, response, body) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });
    });

});