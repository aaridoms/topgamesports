const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const Event = require("../models/Event.model.js");
const Game = require("../models/Game.model.js");

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");
const uploader = require("../middlewares/cloudinary.middleware.js");

// GET "/user" => Rendeiza la vista de perfil de usuario.
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.user._id).populate(
      "favGame"
    );
    const userEvent = await Event.find({ participants: req.session.user._id });
    res.render("user/profile.hbs", {
      foundUser,
      userEvent,
    });
  } catch (error) {
    next(error);
  }
});

// POST "user/profile-pic" => Actualiza la imagen de perfil del usuario.
router.post(
  "/profile-pic",
  isLoggedIn,
  uploader.single("profilePic"),
  async (req, res, next) => {
    try {
      let photoUrl;
      const foundUser = await User.findById(req.session.user._id).populate(
        "favGame"
      );
      const userEvent = await Event.find({
        participants: req.session.user._id,
      });
      if (!req.file) {
        res.status(400).render("user/profile", {
          errorMessage: "Not file detected",
          foundUser,
          userEvent,
        });

        return;
      } else {
        photoUrl = req.file.path;
      }

      await User.findByIdAndUpdate(req.session.user._id, {
        profilePic: photoUrl,
      });
      res.redirect("/user");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/user/list" => Renderiza la vista de lista de usuarios.
router.get("/list", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const listOfUsers = await User.find({ role: "user" });
    res.render("admin/admin-user-list.hbs", {
      listOfUsers,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/user/:userId/delete" => Elimina el usuario.
router.get("/:userId/delete", isLoggedIn, isAdmin, async (req, res, next) => {
  // COMO BONUS PONER UN MENSAJE DE CONFIRMACIÓN DE BORRADO
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.redirect("/user/list");
  } catch (error) {
    next(error);
  }
});

// POST "/user/:gameId/favgame" => Añade el juego a la lista de favoritos del usuario.
router.post("/:gameId/favgame", isLoggedIn, async (req, res, next) => {
  try {
    let currentUser = await User.findById(req.session.user._id);
    let oneGame = await Game.findById(req.params.gameId);

    if (currentUser.favGame.includes(req.params.gameId)) {
      res.status(400).render("game/game-details", {
        message: "Game already in your favorites!",
        oneGame,
      });
    } else {
      oneGame = await Game.findById(req.params.gameId);
      await User.findByIdAndUpdate(req.session.user._id, {
        $push: { favGame: oneGame._id },
      });
      res.render("game/game-details", {
        oneGame,
        message: "Game added to your favorites!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST "/user/:gameId/unfavgame" => Elimina el juego de la lista de favoritos del usuario.
router.post("/:gameId/no-favgame", isLoggedIn, async (req, res, next) => {
  try {
    let currentUser = await User.findById(req.session.user._id);
    let oneGame = await Game.findById(req.params.gameId);
    if (!currentUser.favGame.includes(req.params.gameId)) {
      res.status(400).render("game/game-details", {
        message: "Game not in your favorites!",
        oneGame,
      });
    } else {
      oneGame = await Game.findById(req.params.gameId);
      await User.findByIdAndUpdate(req.session.user._id, {
        $pull: { favGame: oneGame._id },
      });
      res.render("game/game-details", {
        oneGame,
        message: "Game deleted from your favorites!",
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
