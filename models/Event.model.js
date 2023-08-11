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