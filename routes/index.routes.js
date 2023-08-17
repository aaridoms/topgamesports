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

// router.get("/", async (req, res, next) => {
//   const options = {
//     method: "GET",
//     url: `https://allsportsapi2.p.rapidapi.com/api/esport/matches/${fechaFormateada}`,
//     headers: {
//       "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
//       "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
//     },
//   };

//   try {
//     const allGames = await Game.find().limit(3).skip(4);
//     const allEvents = await Event.find().limit(4).populate("game");

//     const response = await axios.request(options);

//     response.data.events.forEach(async (eachId) => {
//       return awayT = eachId.awayTeam.id;
//     });

//     response.data.events.forEach(async (eachId) => {
//       return homeT = eachId.homeTeam.id;
//     });

//     const options2 = {
//       method: "GET",
//       url: `https://allsportsapi2.p.rapidapi.com/api/esport/team/${awayT}/image`,
//       headers: {
//         "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
//         "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
//       },
//       responseType: "arraybuffer"
//     };

//     const options3 = {
//       method: "GET",
//       url: `https://allsportsapi2.p.rapidapi.com/api/esport/team/${homeT}/image`,
//       headers: {
//         "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
//         "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
//       },
//       responseType: "arraybuffer"
//     };

//     const response2 = await axios.request(options2);
//     const response3 = await axios.request(options3);

//     const imageBuffer1 = Buffer.from(response2.data, "binary");
//     const imageUrl1 = `data:image/webp;base64,${imageBuffer1.toString("base64")}`;

//     const imageBuffer2 = Buffer.from(response3.data, "binary");
//     const imageUrl2 = `data:image/webp;base64,${imageBuffer2.toString("base64")}`;

//     const limitResponse = response.data.events.slice(0, 10);

//     const eventWithImage = limitResponse.map((event) => {
//       return {
//         ...event,
//         imageA: imageUrl1,
//         imageH: imageUrl2,
//       };
//     });

//     console.log(eventWithImage);

//     res.render("index", {
//       allGames,
//       allEvents,
//       apiN: eventWithImage,
//       // teamImage: imageUrl,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/", async (req, res, next) => {
  const options = {
    method: "GET",
    url: `https://allsportsapi2.p.rapidapi.com/api/esport/matches/${fechaFormateada}`,
    headers: {
      "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
      "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
    },
  };

  try {
    const allGames = await Game.find().limit(3).skip(4);
    const allEvents = await Event.find().limit(4).populate("game");

    const response = await axios.request(options);

    const eventWithImages = await Promise.all(
      response.data.events.map(async (event) => {
        const awayTeamId = event.awayTeam.id;
        const homeTeamId = event.homeTeam.id;

        const options2 = {
          method: "GET",
          url: `https://allsportsapi2.p.rapidapi.com/api/esport/team/${awayTeamId}/image`,
          headers: {
            "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
            "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
          },
          responseType: "arraybuffer",
        };

        const options3 = {
          method: "GET",
          url: `https://allsportsapi2.p.rapidapi.com/api/esport/team/${homeTeamId}/image`,
          headers: {
            "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
            "X-RapidAPI-Host": process.env.XRAPIDAPIHOST,
          },
          responseType: "arraybuffer",
        };

        const [response2, response3] = await Promise.all([
          axios.request(options2),
          axios.request(options3),
        ]);

        const imageBuffer1 = Buffer.from(response2.data, "binary");
        const imageUrl1 = `data:image/webp;base64,${imageBuffer1.toString(
          "base64"
        )}`;

        const imageBuffer2 = Buffer.from(response3.data, "binary");
        const imageUrl2 = `data:image/webp;base64,${imageBuffer2.toString(
          "base64"
        )}`;

        return {
          ...event,
          imageA: imageUrl1,
          imageH: imageUrl2,
        };
      })
    );

    const limitResponse = eventWithImages.slice(0, 10);

    res.render("index", {
      allGames,
      allEvents,
      apiN: limitResponse,
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
