const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
    default: "https://res.cloudinary.com/ddaezutq8/image/upload/v1692181846/Captura_de_pantalla_2023-08-16_122851_mfrlvr.png",
  },
  genre: [
    {
      type: String,
      enum: [
        "Action",
        "Adventure",
        "RPG",
        "Strategy",
        "Sports",
        "Simulation",
        "MMO",
        "Puzzle",
        "Other",
        "Terror",
        "Shooter",
        "Casual",
        "Fantasy",
        "Platform",
        "Western",
      ],
    },
  ],
  rating: {
    type: Number,
  },
  video: {
    type: String,
  },
  platform: [
    {
      type: String,
      enum: ["Steam", "Sony", "Xbox", "Nintendo"],
    },
  ],
  launchDate: {
    type: Date,
    get: function (date) {
      if (!date) {
        return null;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
  },
  isCompetitive: {
    type: Boolean,
    default: false,
  },
});

const Game = model("Game", gameSchema);

module.exports = Game;
