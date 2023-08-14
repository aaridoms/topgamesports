const express = require('express');
const router = express.Router();

const Game = require('../models/Game.model.js');

const { updateLocals } = require('../middlewares/auth.middleware.js');

router.use(updateLocals)

router.get("/", async (req, res, next) => {
  try {
    const allGames = await Game.find();
    res.render("index", {
      allGames
    });
  } catch (error) {
    next(error);
  }
});

const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

const userRoutes = require('./user.routes');
router.use('/user', userRoutes);

const gameRoutes = require('./game.routes');
router.use('/game', gameRoutes);

const eventRoutes = require('./event.routes');
router.use('/event', eventRoutes);

module.exports = router;
