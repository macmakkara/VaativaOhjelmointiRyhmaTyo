const express = require('express');
const testController = require("../controllers/testController");
const scoreController = require("../controllers/scoreController");
const gameController = require("../controllers/gameController");
const router = express.Router();


/* Testauspalikat yms. satunnainen debug sälä */
router.route('/testconnection').get(testController.testconnection);
router.route('/deleteAllScores').get(testController.deleteAllScores);
router.route('/deleteAllGames').get(testController.deleteAllGames);
router.route('/emptyDatabase').get(testController.emptyDatabase);



/* Public puoli */
router.route('/getallscores').get(scoreController.getAllScores);
router.route('/getgamescore/:game_id').get(scoreController.getGameScore);
router.route('/getplayerscore/:playername').get(scoreController.getPlayerScore);
router.route('/getGameList').get(gameController.getGameList);
router.route('/getGameById/:game_id').get(gameController.findGameById);

/*Admin puoli. Pelien lisääminen jne. */
router.route('/addgame').post(gameController.addGame);
router.route('/addplayerscore').post(scoreController.addPlayerScore);

module.exports = router;