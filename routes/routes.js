const express = require('express');
const testController = require("../controllers/testController");
const scoreController = require("../controllers/scoreController");
const gameController = require("../controllers/gameController");
const router = express.Router();


/* Testauspalikat yms. satunnainen debug sälä */
router.route('/testconnection').get(testController.testconnection);


/* Pelaajien pisteiden hallinta*/
router.route('/getallscores').get(scoreController.getAllScores);
router.route('/getgamescore/:game').get(scoreController.getGameScore);
router.route('/getplayerscore/:playername').get(scoreController.getPlayerScore);
router.route('/addplayerscore').post(scoreController.addPlayerScore);

/*Admin puoli. Pelien lisääminen jne. */
router.route("/addgame").post(gameController.addGame);

module.exports = router;