
const games = [
    {
        title: "The Legend of Zelda Ocarina of Time",
        description:"La historia del juego se enfoca en el joven héroe Link, quien emprende una aventura en el reino de Hyrule para detener a Ganondorf, rey de la tribu Gerudo, antes de que encuentre la Trifuerza, una reliquia sagrada capaz de concederle cualquier deseo a su poseedor. Para ello, debe viajar a través del tiempo y explorar varios templos con el fin de despertar a algunos sabios que tienen el poder para aprisionar de forma definitiva a Ganondorf. ",
        cover:"https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Ocarina_of_Time.jpg",
        genre:["Acción","Aventura","Fantasía"],
        rating:9.1,
        video:"https://youtu.be/F0fPCbtlrCo",
        platform:["Nintendo"],
        launchDate: "November 23,1998",
        isCompetitive:false,
    }



  ];

  
const mongoose = require("mongoose")
const Games = require("../models/Game.model.js")


mongoose.connect("mongodb://127.0.0.1:27017/topgamesports")
.then(()=>{

    return Games.insertMany(games)
})
.then(()=>{

    console.log("Juegos cargados correctamente")
})
.catch((error)=>{

    next(error)
})