const express = require('express');
const router = express.Router();
const passport = require('passport');

const gameController = require('../controllers/game_controller');

router.post('/create', passport.checkAuthentication, gameController.create);


module.exports = router;