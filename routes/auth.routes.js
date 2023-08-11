const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/User.model');

// GET "auth/signup" => Renderiza la vista de signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST "auth/signup" => Recibe los datos del formulario de signup
router.post("/signup",  async (req, res, next) => {

  const { username, email, password, repitPassword } = req.body;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  
  if (username === "" || email === "" || password === "" || repitPassword === "") {
    res.status(400).render("auth/signup", { errorMessage: "Todos los campos son obligatorios" });
    return;
  }

  if (!regexPassword.test(password)) {
    res.status(400).render("auth/signup", { errorMessage: "El email o la contraseña no es válida" });
    return;
  }

  if (!regexEmail.test(email)) {
    res.status(400).render("auth/signup", { errorMessage: "El email o la contraseña no es válida" });
    return;
  }

  if (password !== repitPassword) {
    res.status(400).render("auth/signup", { errorMessage: "Las contraseñas no coinciden" });
    return;
  }

  try {
    const foundUser = await User.findOne( { $or: [{ username: username }, {email: email}] } );
    if (foundUser !== null) {
      res.status(400).render("auth/signup", { errorMessage: "Usuario o email ya existen" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });

    res.redirect("/login");

  } catch (error) {
    next(error);
  }
});

module.exports = router;