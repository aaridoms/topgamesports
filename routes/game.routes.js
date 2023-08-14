const express = require("express");
const router = express.Router();

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");

const Game = require("../models/Game.model.js");

// GET '/game'	=> Lista de todos los juegos
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const allGames = await Game.find();
    res.render("game/game-list", {
      allGames,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/game/:gameId/details" => Detalles de un juego
router.get("/:gameId/details", isLoggedIn, async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const oneGame = await Game.findById(gameId);
    res.render("game/game-details", {
      oneGame,
    });
  } catch (error) {
    next(error);
  }
});
// GET "/game/list" => Lista de todos los juegos. Solo vista para admin

router.get("/list", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const allGames = await Game.find();
    res.render("admin/admin-game-list", { allGames });
  } catch (error) {
    next(error);
  }
});

// GET "/game/:gameId/delete" => Elimina el juego
router.get("/:gameId/delete", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await Game.findByIdAndDelete(req.params.gameId);
    res.redirect("/game/list");
  } catch (error) {
    next(error);
  }
});
// GET "/game/new-game" => Renderiza al formulario de "añadir juegos"
router.get("/new-game", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin/admin-new-game");
});

// post "/game/new-game" => Inserta un nuevo juego en la base de datos
router.post("/new-game", isLoggedIn, isAdmin, async (req, res, next) => {
  const {
    title,
    description,
    cover,
    genre,
    rating,
    video,
    platform,
    launchDate,
    isCompetitive,
  } = req.body;

  if (
    title === "" ||
    description === "" ||
    cover === "" ||
    genre === "" ||
    rating === "" ||
    video === "" ||
    platform === "" ||
    launchDate === "" ||
    isCompetitive === ""
  ) {
    res
      .status(400)
      .render("admin/admin-new-game", {
        errorMessage: "Los campos no pueden estar vacios",
      });
    return;
  }

  try {
    await Game.create({
      title,
      description,
      cover,
      genre,
      rating,
      video,
      platform,
      launchDate,
      isCompetitive,
    });
    res.redirect("/game/list");
  } catch (error) {
    next(error);
  }
});

// GET "/game/:gameId/edit" => Renderiza al formulario de "editar juegos"
router.get("/:gameId/edit", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const oneGame = await Game.findById(req.params.gameId);
    res.render("admin/admin-game-edit", { oneGame });
  } catch (error) {
    next(error);
  }
});

// POST "/game/:gameId/edit" => Edita un juego en la base de datos
router.post("/:gameId/edit", isLoggedIn, isAdmin, async (req, res, next) => {
  const {
    title,
    description,
    cover,
    genre,
    rating,
    video,
    platform,
    launchDate,
    isCompetitive,
  } = req.body;

  if (
    title === "" ||
    description === "" ||
    cover === "" ||
    genre === "" ||
    rating === "" ||
    video === "" ||
    platform === "" ||
    launchDate === "" ||
    isCompetitive === ""
  ) {
    res
      .status(400)
      .render("admin/admin-game-edit", {
        errorMessage: "Los campos no pueden estar vacios",
      });
    return;
  }

  try {
    await Game.findByIdAndUpdate(req.params.gameId, {
      title,
      description,
      cover,
      genre,
      rating,
      video,
      platform,
      launchDate,
      isCompetitive,
    });
    res.redirect("/game/list");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
