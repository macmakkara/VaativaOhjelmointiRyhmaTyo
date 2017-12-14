var main = angular.module("main", []);
var apiUrl = "http://localhost:3333/api/";

main.controller("mainController", function ($scope, $http, $interval, $timeout, testService, mockdataService, db_service) {
    console.log("main!");

    //Debuggausta varten, testaa vastaako palvelin pyyntöihin
    testService.tarkistaPalvelimenTila().then(function (tila) {
        $scope.serverStatus = tila;
    });

    $scope.sanitycheck_view = true; //Tarkistaa, että app ja view keskustelee keskenään (eli true tulostuu täältä html sivulle)
    $scope.sanitycheck_service = testService.sanitycheck; //Tarkistaa, että app ja service keskustelee keskenään (eli true tulostuu servicestä)


    $scope.mockPeli = {
        "peli_nimi":"Testipeli"
    };

    
    $scope.viesti = ""; //viimeisin tietokannasta tullut vastaus (virhe tai successmessage)

    //Luo satunnaisen pelin nimen, pelaajan, pisteet (ja tokenin)
    $scope.LuoMockPisteet = function () {
        mockdataService.luoSatunnainenPistedata().then(function(vastaus){
            $scope.mockPisteet = vastaus;
        });

    };

    //Hakee scoresin sisällön
    $scope.haeKaikkienPelienPisteet = function () {
        db_service.haeKaikkiPisteet().then(function (vastaus) {
            $scope.viesti = vastaus;
            $scope.kaikkipisteet = vastaus;
        });
    };

    //Lähettää pistedataa scoresiin
    $scope.lahetaPisteet = function(pistedata){
        db_service.lahetaPisteet(pistedata).then(function(vastaus){
            $scope.viesti = vastaus;

        });
    };

    //Lähettää pelin gamesiin
    $scope.lahetaPeli = function(pelidata){

        db_service.uusiPeli(pelidata).then(function(vastaus){
            $scope.viesti = vastaus;
        });
    };



    $scope.tyhjennaPisteet = function(){

        mockdataService.tyhjennaPisteet().then(function(vastaus){
            $scope.viesti = vastaus;
        });
    };


    $scope.haeKaikkiPelit = function(){

        db_service.haePelit().then(function(vastaus){
            $scope.viesti = vastaus;
            $scope.pelilista = vastaus.data;
        });
    };


    $scope.init = function () {
        $scope.LuoMockPisteet();
        $scope.haeKaikkienPelienPisteet();
        $scope.haeKaikkiPelit();

    };


    $scope.init();



});


