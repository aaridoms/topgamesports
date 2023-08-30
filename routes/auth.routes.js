const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User.model");

// GET "auth/signup" => Renderiza la vista de signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST "auth/signup" => Recibe los datos del formulario de signup
router.post("/signup", async (req, res, next) => {
  const { username, email, password, repitPassword } = req.body;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const regexEmail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if (
    username === "" ||
    email === "" ||
    password === "" ||
    repitPassword === ""
  ) {
    res.status(400).render("auth/signup", {
      errorMessage: "All fields are required",
    });
    return;
  }

  if (!regexPassword.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage: "The email or password is invalid",
    });
    return;
  }

  if (!regexEmail.test(email)) {
    res.status(400).render("auth/signup", {
      errorMessage: "The email or password is invalid",
    });
    return;
  }

  if (password !== repitPassword) {
    res
      .status(400)
      .render("auth/signup", { errorMessage: " Passwords do not match" });
    return;
  }

  try {
    const foundUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (foundUser !== null) {
      res
        .status(400)
        .render("auth/signup", { errorMessage: " User or email already exist" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

//GET "/auth/login" => renderiza al usuario un formulario de acces
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST "/auth/login" => recibe las credenciales del usuario y valirdar/autentificarlo
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ username: username });

    if (foundUser === null) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Username does not exist",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (isPasswordCorrect === false) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "The password does not match",
      });
      return;
    }

    req.session.user = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role,
      profilePic: foundUser.profilePic
    };

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

// GET "/auth/logout" => Le permite al usuario cerrar la sesion activa
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
