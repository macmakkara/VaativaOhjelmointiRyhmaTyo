var main = angular.module("main", ['angular-growl', 'ngAnimate']);
var apiUrl = "http://seiz.in:3333/api/";


main.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive({ success: 3000, error: 5000, warning: 3000, info: 3000 });
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalPosition('bottom-center');
    growlProvider.onlyUniqueMessages(false);
}]);



main.controller("mainController", function ($scope, $http, $interval, $timeout, testService, mockdataService, db_service, growl) {
    console.log("main!");

    //Debuggausta varten, testaa vastaako palvelin pyyntöihin
    testService.tarkistaPalvelimenTila().then(function (tila) {
        $scope.serverStatus = tila;
    });

    $scope.sanitycheck_view = true; //Tarkistaa, että app ja view keskustelee keskenään (eli true tulostuu täältä html sivulle)
    $scope.sanitycheck_service = testService.sanitycheck; //Tarkistaa, että app ja service keskustelee keskenään (eli true tulostuu servicestä)


    $scope.mockPeli = {
        "peli_nimi": "Testipeli"
    };

    //Luo satunnaisen pelin nimen, pelaajan, pisteet (ja tokenin)
    $scope.LuoMockPisteet = function () {
        mockdataService.luoSatunnainenPistedata().then(function (vastaus) {
            $scope.mockPisteet = {
                "player": vastaus.player,
                "score": vastaus.score,
                "game_id":$scope.mockPisteet.game_id,
                "gametoken": $scope.mockPisteet.gametoken,
            };

        });
    },

        //Hakee scoresin sisällön
        $scope.haeKaikkienPelienPisteet = function () {
            db_service.haeKaikkiPisteet().then(function (vastaus) {
                if (vastaus.status !== 200) {
                    $scope.luoVirhe(vastaus);
                } else {
                    $scope.kaikkipisteet = vastaus.data;
                }
            });
        };

        //Lähettää pistedataa scoresiin
        $scope.lahetaPisteet = function (pistedata) {
            db_service.lahetaPisteet(pistedata).then(function (vastaus) {

                if (vastaus.status == 200) {
                    $scope.luoViesti(vastaus, "Pisteet lähetetty onnistuneesti")
                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }

            });
        };

        //Lähettää pelin gamesiin
        $scope.lahetaPeli = function (pelidata) {

            db_service.uusiPeli(pelidata).then(function (vastaus) {
                if (vastaus.status == 200) {
                    $scope.pelitoken = vastaus.data;
                    $scope.luoViesti(vastaus, "Peli lisätty onnistuneesti")
                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }
            });
        };



        $scope.tyhjennaPisteet = function () {

            mockdataService.tyhjennaPisteet().then(function (vastaus) {
                if (vastaus.status == 200) {
                    $scope.luoViesti(vastaus, "Pisteet tyhjennetty onnistuneesti")
                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }
            });
        };

        $scope.tyhjennaKanta = function () {

            mockdataService.tyhjennaKanta().then(function (vastaus) {
                if (vastaus.status == 200) {
                    $scope.luoViesti(vastaus, "Kanta tyhjennetty onnistuneesti")
                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }
            });
        };


        $scope.haeKaikkiPelit = function () {

            db_service.haePelit().then(function (vastaus) {

                if (vastaus.status == 200) {
                    $scope.pelilista = vastaus.data;
                    $scope.valittuPeli = vastaus.data[0];

                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }

            });
        };

        $scope.haePelinPisteet = function (peli_id) {

            return db_service.haePelinPisteet(peli_id).then(function (vastaus) {
                if (vastaus.status == 200) {
                    return vastaus.data;
                } else {
                    $scope.luoViesti(vastaus, vastaus.data);
                }
            });
        };



        $scope.init = function () {
            $scope.LuoMockPisteet();
            $scope.haeKaikkienPelienPisteet();
            $scope.haeKaikkiPelit();

        };


        $scope.init();


        $scope.naytaViesti = function () {
            console.log("GROWL");
            console.log(growl);
            growl.warning('This is warning message.', { title: 'Warning!' });
            growl.error('This is error message.', { title: 'Error!' });
            growl.success('This is success message.', { title: 'Success!' });
            growl.info('This is an info message.', { title: 'Info!' });
        }



        $scope.luoViesti = function (response, viesti) {

            if (response.status == 200) {
                growl.success(viesti, { title: 'Toiminto onnistui' });
            } else {
                growl.error(viesti, { title: 'Tapahtui virhe!' });
            }
        };


    });


