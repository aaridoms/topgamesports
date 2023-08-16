const express = require("express");
const router = express.Router();

const Event = require("../models/Event.model.js");
const Game = require("../models/Game.model.js");

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");

// GET "/event" => renderiza la vista de eventos
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const allEvents = await Event.find().sort({ startDate: 1 }).populate("game");
    res.render("event/event-list", {
      allEvents,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/event/:eventId/details" => renderiza la vista de un evento
router.get("/:eventId/details", isLoggedIn, async (req, res, next) => {
  try {
    const oneEvent = await Event.findById(req.params.eventId)
      .populate("game")
      .populate("participants");
    const numberOfParticipants = oneEvent.participants.length;

    res.render("event/event-details", {
      oneEvent,
      numberOfParticipants,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/event/list" => lista de eventos para el crud de admin
router.get("/list", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const allEvents = await Event.find().populate("game");
    res.render("admin/admin-event-list", {
      allEvents,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/event/create" => renderiza la vista de creación de eventos
router.get("/new-event", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const allGames = await Game.find();
    res.render("admin/admin-new-event", {
      allGames,
    });
  } catch (error) {}
});

// POST "/event/create" => crea un evento
router.post("/new-event", isLoggedIn, isAdmin, async (req, res, next) => {
  const { name, description, startDate, imageUrl, game } = req.body;

  
  try {

    const allGames = await Game.find().select({title: 1})
    if (name === "" || description  === "" || startDate  === "" || imageUrl === "" || game  === "") {
      res.render("admin/admin-new-event", {
        errorMessage: "Todos los campos son obligatorios",
        allGames
      });
      return;
    }
    await Event.create({ name, description, startDate, imageUrl, game });
    res.redirect("/event/list");
  } catch (error) {
    next(error);
  }
});

// GET "/event/:eventId/delete" => elimina un evento
router.get("/:eventId/delete", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.redirect("/event/list");
  } catch (error) {
    next(error);
  }
});

// GET "/event/:eventId/edit" => renderiza la vista de edición de eventos
router.get("/:eventId/edit", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const oneEvent = await Event.findById(req.params.eventId);
    const allGames = await Game.find().select({ title: 1 });

    const cloneAllGames = JSON.parse(JSON.stringify(allGames));

    cloneAllGames.forEach((eachGame) => {
      if (oneEvent.game.toString() === eachGame._id.toString()) {
        eachGame.isSelected = true;
      }
    });

    res.render("admin/admin-event-edit", {
      oneEvent,
      cloneAllGames,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/event/:eventId/edit" => edita un evento
router.post("/:eventId/edit", isLoggedIn, isAdmin, async (req, res, next) => {
  const { name, description, startDate, imageUrl, game } = req.body;
  try {
    const oneEvent = await Event.findById(req.params.eventId);
    const allGames = await Game.find().select({ title: 1 });

    const cloneAllGames = JSON.parse(JSON.stringify(allGames));

    cloneAllGames.forEach((eachGame) => {
      if (oneEvent.game.toString() === eachGame._id.toString()) {
        eachGame.isSelected = true;
      }
    });

    if (name === "" || description  === "" || startDate  === "" || imageUrl === "" || game  === "") {
      res.render("admin/admin-event-edit", {
        errorMessage: "Todos los campos son obligatorios",
        oneEvent,
      cloneAllGames,
      });
      return;
    }
    await Event.findByIdAndUpdate(req.params.eventId, {
      name,
      description,
      startDate,
      imageUrl,
      game,
    });
    res.redirect("/event/list");
  } catch (error) {
    next(error);
  }
});

// POST "/event/:eventId/join" => Usuario se añade al evento
router.post("/:eventId/join", isLoggedIn, async (req, res, next) => {
  try {
    let oneEvent = await Event.findById(req.params.eventId).populate("game");
    let numberOfParticipants = oneEvent.participants.length;
    if (oneEvent.participants.includes(req.session.user._id)) {
      res.status(400).render("event/event-details", {
        messageError: "Ya estás añadido al evento",
        oneEvent,
        numberOfParticipants,
      });
    } else {
      oneEvent = await Event.findByIdAndUpdate(
        req.params.eventId,
        { $push: { participants: req.session.user._id } },
        { new: true }
      ).populate("game");
      numberOfParticipants = oneEvent.participants.length;
      console.log(oneEvent);
      
      res.render("event/event-details", {
        oneEvent,
        numberOfParticipants,
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST "/event/:eventId/leave" => Usuario se elimina del evento
router.post("/:eventId/leave", isLoggedIn, async (req, res, next) => {
  try {
    let oneEvent = await Event.findById(req.params.eventId).populate("game");
    let numberOfParticipants = oneEvent.participants.length;
    if (!oneEvent.participants.includes(req.session.user._id)) {
      res.status(400).render("event/event-details", {
        messageError: "No estas en el evento",
        oneEvent,
        numberOfParticipants,
      });
    } else {
      oneEvent = await Event.findByIdAndUpdate(
        req.params.eventId,
        { $pull: { participants: req.session.user._id } },
        { new: true }
      ).populate("game");
      numberOfParticipants = oneEvent.participants.length;
      
      res.render("event/event-details", {
        oneEvent,
        numberOfParticipants,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;