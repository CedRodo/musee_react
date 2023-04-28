const { Router } = require("express");
const { Oeuvre } = require("./models");

const route = Router();

route.get("/collections", async function(request, response) {
    const toutesOeuvres = await Oeuvre.find();
    response.json({ message: "Bienvenue sur la page d'accueil", body: toutesOeuvres });
});

module.exports = route;