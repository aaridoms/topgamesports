const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/auth.middleware.js');

const Game = require('../models/Game.model.js');

// GET '/game'	=> Lista de todos los juegos
router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const allGames = await Game.find();
    res.render('game/game-list', {
      allGames});
  } catch (error) {
    next(error);
  }
});

// GET "/game/:gameId/details" => Detalles de un juego
router.get('/:gameId/details', isLoggedIn, async (req, res, next) => {

  const { gameId } = req.params;

  try {
    const oneGame = await Game.findById(gameId);
    res.render('game/game-details', {
      oneGame
    }); 
  } catch (error) {
    next(error);
  }
});

module.exports = router;