const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true
  },
  startDate: {
    type: Date,
    get: function(date) {
      if (!date) {
        return null;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    require: true
  },
  imageUrl: {
    type: String,
    default: ""
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game"
  }
});

const Event = model("Event", eventSchema);

module.exports = Event;