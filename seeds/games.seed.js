const mongoose = require("mongoose");
require("../db/index.js");

const Game = require("../models/Game.model.js");

const games = require("./games.json");

const insertGames = async (seed) => {
  try {
    await Game.insertMany(seed);
    console.log("Games added to the DB")
    await mongoose.connection.close();
  } catch (error) {
    console.log("Error anadiendo juegos a la BBDD: ", error);
  }
};

insertGames(games);