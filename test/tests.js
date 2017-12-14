const expect = require("chai").expect;
const request = require("request");
const http = require('http');
const serverConfig = require("../configs/server")

var ip = require("ip");
const apiUrl =  "http://" + ip.address() + ":" + serverConfig.portti + "/api/";
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
    "peli_nimi": "Blinkenlights - Mocha Explosion",
    "game_id": "",
    "gametoken":""
};

var peli_2 = {
    "peli_nimi": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇ‌​ÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜ‌​ÝÞßàáâãäåæçèéêëìíîïð",
    "game_id": "",
    "gametoken":""
};

var peli_3 = {
    "peli_nimi": "<>#%{}|\^~[];/?:@=&",
    "game_id": "",
    "gametoken":""
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
            request.post(url, { "game_id": "" }, function (error, response, body) {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });
    });

    describe("Parametri gametoken on tyhjä merkkijono", function () {
        it("Palauttaa statuskoodin 400 Bad Request", function (done) {
            request.post(url, { "game_id": "" }, function (error, response, body) {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });
    });

    //TODO, koko loppurouten tutkiminen.



});
