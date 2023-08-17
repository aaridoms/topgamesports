const express = require("express");
const router = express.Router();
const axios = require("axios");

const Game = require("../models/Game.model.js");
const User = require("../models/User.model.js");
const Event = require("../models/Event.model.js");

const { updateLocals } = require("../middlewares/auth.middleware.js");

router.use(updateLocals);

let fechaActual = new Date();

let dia = fechaActual.getDate();
let mes = fechaActual.getMonth() + 1;
let anio = fechaActual.getFullYear();

if (dia < 10) {
  dia = "0" + dia;
}
if (mes < 10) {
  mes = "0" + mes;
}

let fechaFormateada = dia + "/" + mes + "/" + anio;

router.get("/", async (req, res, next) => {
  const options = {
    method: "GET",
    url: `https://allsportsapi2.p.rapidapi.com/api/esport/matches/${fechaFormateada}`,
    headers: {
      "X-RapidAPI-Key": "b04aa8727dmsh4fa1126f9836223p19fff3jsne76fa6a32aea",
      "X-RapidAPI-Host": "allsportsapi2.p.rapidapi.com",
    },
  };

  try {
    const allGames = await Game.find().limit(3).skip(4);
    const allEvents = await Event.find().limit(4).populate("game");

    const response = await axios.request(options);
    // console.log(response.data);

    const limitResponse = response.data.events.slice(0, 10);

    const options2 = {
      method: "GET",
      url: `https://allsportsapi2.p.rapidapi.com/api/esport/team/363944/image`,
      headers: {
        "X-RapidAPI-Key": "b04aa8727dmsh4fa1126f9836223p19fff3jsne76fa6a32aea",
        "X-RapidAPI-Host": "allsportsapi2.p.rapidapi.com",
      },
    };

    const response2 = await axios.request(options2);
    // console.log(response2.data);

    res.render("index", {
      allGames,
      allEvents,
      apiN: limitResponse,
      teamImage: response2.data,
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
