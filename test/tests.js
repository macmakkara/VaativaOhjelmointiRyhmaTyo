const expect = require("chai").expect;
const request = require("request");
const http = require('http');
const serverConfig = require("../configs/server")

var ip = require("ip");
const apiUrl = "http://" + ip.address() + ":" + serverConfig.portti + "/api/";
var palvelin = require('../main');


before(done => {
    console.log("---------------------------------------");
    console.log("Ennen testien ajoa tehtävät funktiot...");
    console.log("---------------------------------------");
    console.log(apiUrl)

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




describe("geneeriset testit (onko serveri päällä, vastaako kutsuihin jne..)", function () {

    let url = apiUrl + "testconnection"

    describe("testconnection", function () {

        it("Palauttaa statuskoodin 200 OK", function (done) {
            request(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

    });

});



describe("POST - addgame", function () {

    let url = apiUrl + "addgame"

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

    let url = apiUrl + "addplayerscore"

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


    describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " valideilla parametreilla", function () {
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

    describe("Pisteiden lisäys peliin: " + peli_3.peli_nimi + " valideilla parametreilla", function () {
        it("Palauttaa statuskoodin 200 OK", function (done) {
            pistedata_1.game_id = peli_3.game_id;
            pistedata_1.gametoken = peli_3.gametoken;
            pistedata_1.score = 3000;

            request.post(url, { json: pistedata_1 }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });



    describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " väärällä id:llä (oikea token)", function () {
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


    describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " pelin " + peli_2.peli_nimi + " tokenilla (oikea id, väärä token)", function () {
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

    describe("Pisteiden lisäys peliin: " + peli_1.peli_nimi + " pelin " + peli_2.peli_nimi + " id:llä (oikea token, väärä id)", function () {
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





    //TODO, koko loppurouten tutkiminen.



});
