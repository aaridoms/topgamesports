const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user"
    },
    favGame: [{
      type: Schema.Types.ObjectId,
      ref: "Game"
    }],
    profilePic: {
      type: String,
      default: "images/userDefault.jpg"
    }
  },
  {    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;