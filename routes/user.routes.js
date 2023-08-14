const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");
const uploader = require("../middlewares/cloudinary.middleware.js");

// GET "/user" => Rendeiza la vista de perfil de usuario.
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.user._id);
    res.render("user/profile.hbs", {
      foundUser,
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
      await User.findByIdAndUpdate(req.session.user._id, {
        profilePic: req.file.path,
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



module.exports = router;