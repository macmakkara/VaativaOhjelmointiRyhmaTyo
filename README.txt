Readme.TXT

Projektiaihe 3/4 Geneerinen käyttäjien Pistedatan seuranta.

Tekijät: Jani Rantanen, Joni Salonen


Projektin tarkoitus on toimia rajapintana ja palveluna pelitulosten seurantaan eri peleille.
 
Palvelu ottaa vastaan JSON tietoa apiurl:iin tallentaan tiedot MongoDB:hen. 
Apilla on mahdollista hakea tietoa peleittäin tai käyttäjittäin ja tuottaa data clientille(Pelille) JSON muodossa.




TEKNINEN DOKUMENTAATIO (alustava)


Kaikki alla olevat reitit alkaa apin urlilla. Esim paikallisesti testattuna ne alkavat osoitteella:
http://localhost:3333/api/

Jonka jälkeen lisätään tarkka polku. Esim. jos haluaa kaikkien pelien pisteet
http://localhost:3333/api/getallscores



getallscores
    Get pyyntö -> Palauttaa kaikkien pelien ja pelaajien pisteet JSON arrayna, jossa seuraavankaltaisia tietoja:
    {
    "game_id":"5a38468c61a53c47cf9a4d48", //Pelin id, käytetään public puolen hauissa
    "player":"Tero Testaaja", //Pelaajan nimi
    "score":4514, //pelaajan pisteet
    "timestamp":"1513637540798", //Milloin pisteet lisätty
    "game":{
        "peli_nimi":"Testipeli" //Mikä pelin selkokielinen nimi on
        }
    }


getgamescore/<game_id>
    GET pyyntö, jossa parametrina halutun pelin id -> palauttaa kyseisen pelin kaikki tallennetut pistetulokset JSON arrayna, jossa seuraavankaltaisia tietoja:
    {
        "player":"Tero testaaja", //pelaajan nimi
        "score":1920  //pelaajan pisteet
        "timestamp":"1513638711436" //Milloin pisteet lisätty
    }


getplayerscore/<playername>/<game_id>
    GET pyyntö, jossa parametrina halutun pelin id (ja valinnaisesti game_id) -> palauttaa kyseisen pelaajanimen kaikki tallennetut pistetulokset JSON arrayna (kaikista peleistä, ellei määritä game_id:tä), jossa seuraavankaltaisia tietoja:
    {
        "player":"Tero testaaja", //pelaajan nimi
        "score":1920  //pelaajan pisteet
        "timestamp":"1513638711436" //Milloin pisteet lisätty
    }

getGameList
    GET pyyntö -> palauttaa kaikki tietokannassa olevat pelit JSON arrayna, jossa seuraavankaltaisia tietoja:
    {
        "_id":"5a384b22c41c7e503730926c" //Pelin id
        "peli_nimi":"Testipeli", //Pelin selkokielinen nimi
        "timestamp":"1513638690118" //Milloin lisätty 
    }

getGameById/<game_id>
    GET pyyntö -> palauttaa tietyn pelin tiedot tietokannasta JSON arrayna, jossa seuraavankaltaisia tietoja:
    {
        "_id":"5a384b22c41c7e503730926c" //Pelin id
        "peli_nimi":"Testipeli", //Pelin selkokielinen nimi
        "timestamp":"1513638690118" //Milloin lisätty 
    }


addgame
    POST pyyntö, johon annettava seuraavanlaiset tiedot (kaikki pakollisia):
    {
        "peli_nimi" <pelin selkokielinen nimi>
    }

    pyyntö palauttaa JSONina seuraavankaltaisen tiedon:

    {
        "game_id":<lisätyn pelin id>
        "gametoken":<lisätyn pelin token>
    }

    tietoja käytetään pisteiden lisäämiseen




addplayerscore
    POST pyyntö, johon annettava seuraavanlaiset tiedot:
    {
        "game_id":<game_id>,
        "gametoken":<pelin token>,
        "player": <pelaajan nimi>,
        "score": <pelaajan_pisteet>
    }

Kaikissa reiteissä on virheenkäsittelyä ja palauttavat statuskoodin:
    200 jos kaikki on ok,
    400 jos tiedot on puutteellisia tai vääriä,
    404 jos tietoa ei löydy,
    500 geneerisestä virheestä