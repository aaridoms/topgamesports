# TOPGAMESPORTS ![App-Name](./public/images/favicon.ico)

## [Deploy](https://topgamesports.adaptable.app/)

![App-Name](./public/images/topgamesports.png)

# Description ![App-Name](./public/images/favicon.ico)
Platform for video game news and events, for you gamers!

---

## API Routes (Back-End)
### Auth Routes
GET / "auth/signup" => Renderiza la vista de signup
POST / "auth/signup" => Recibe los datos del formulario de signup
GET / "/auth/login" => renderiza al usuario un formulario de acces
POST / "/auth/login" => recibe las credenciales del usuario y valirdar/autentificarlo
GET / "/auth/logout" => Le permite al usuario cerrar la sesion activa

### User Routes
GET / "/user" => Rendeiza la vista de perfil de usuario.
POST / "user/profile-pic" => Actualiza la imagen de perfil del usuario.
GET / "/user/list" => Renderiza la vista de lista de usuarios.
GET / "/user/:userId/delete" => Elimina el usuario.
POST / "/user/:gameId/favgame" => Añade el juego a la lista de favoritos del usuario.
POST / "/user/:gameId/unfavgame" => Elimina el juego de la lista de favoritos del usuario.

### Game Routes
GET / '/game'	=> Lista de todos los juegos
GET / "/game/:gameId/details" => Detalles de un juego
GET / "/game/list" => Lista de todos los juegos. Solo vista para admin
GET / "/game/:gameId/delete" => Elimina el juego
GET / "/game/new-game" => Renderiza al formulario de "añadir juegos"
POST / "/game/new-game" => Inserta un nuevo juego en la base de datos
GET / "/game/:gameId/edit" => Renderiza al formulario de "editar juegos"
POST / "/game/:gameId/edit" => Edita un juego en la base de datos
POST / "/game/filter/rating-up" => Filtra los juegos por rating descendente
POST / "/game/filter" => Filtra los juegos por rating ascendente
POST / "/game/filter/launch-date-up" => Filtra los juegos por fecha de lanzamiento descendente
POST / "/game/filter/launch-date-down" => Filtra los juegos por fecha de lanzamiento ascendente
POST / "/game/filter/competitive" => Filtra los juegos por competitivo

### Event Routes
GET / "/event" => renderiza la vista de eventos
GET / "/event/:eventId/details" => renderiza la vista de un evento
GET / "/event/list" => lista de eventos para el crud de admin
GET / "/event/create" => renderiza la vista de creación de eventos
POST / "/event/create" => crea un evento
GET / "/event/:eventId/delete" => elimina un evento
GET / "/event/:eventId/edit" => renderiza la vista de edición de eventos
POST / "/event/:eventId/edit" => edita un evento
POST / "/event/:eventId/join" => Usuario se añade al evento
POST / "/event/:eventId/leave" => Usuario se elimina del evento
GET / /event/esports => renderiza la vista de eventos de esports mediante 3 llamadas a una API

---

## Models

### User Model
~~~~
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
~~~~

### Game Model
~~~~
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
        "MMO",
        "Shooter",
        "Casual",
        "Fantasy",
        "Platform",
        "Western",
        "MOBA",
        "Terror"
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
      enum: ["PC", "Sony", "Xbox", "Nintendo"],
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
~~~~

### Event Model
~~~~
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
~~~~

---

## Links
| Slides | Deploy | Sergio | Angel |
|---|---|---|---|
| [Link]() | [Link](https://topgamesports.adaptable.app/) | [Link](https://www.linkedin.com/in/sergio-puyod/) | [link](https://www.linkedin.com/in/angelariasdom/) |