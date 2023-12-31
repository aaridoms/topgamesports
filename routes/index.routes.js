const express = require("express");
const router = express.Router();

const Game = require("../models/Game.model.js");
const User = require("../models/User.model.js");
const Event = require("../models/Event.model.js");

const { updateLocals } = require("../middlewares/auth.middleware.js");

router.use(updateLocals);

router.get("/", async (req, res, next) => {
  
  try {
    const randomNumber = Math.floor(Math.random()*10)
    const allGames = await Game.find().limit(3).skip(randomNumber);
    const allEvents = await Event.find().limit(4).populate("game");

    res.render("index", {
      allGames,
      allEvents,
    });
  } catch (error) {
    next(error);
  }
});

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const userRoutes = require("./user.routes");
router.use("/user", userRoutes);

const gameRoutes = require("./game.routes");
router.use("/game", gameRoutes);

const eventRoutes = require("./event.routes");
router.use("/event", eventRoutes);

module.exports = router;
