const { Router } = require("express");
const { Oeuvre } = require("./models");

const route = Router();

route.get("/:id", async function(request, response) {
    const id = request.params.id;
    const getOeuvre = await Oeuvre.findById(id);
    if (!getOeuvre) return response.status(404).json({ message: `L'oeuvre ${id} est introuvable` })
    response.json(getOeuvre);
});

route.get("/", async function(request, response) {
    const toutesOeuvres = await Oeuvre.find();
    response.json({ message: "Toutes les collections", body: toutesOeuvres });
});

route.get("/oeuvres/:recherche", async function(request, response) {
    const recherche = request.params.recherche;
    console.log(recherche);
    const oeuvresTrouvees = await Oeuvre.find({titre: {$regex: recherche, $options: 'i'}});
    console.log(oeuvresTrouvees);
    if (!oeuvresTrouvees) return response.status(404).json({ message: `Aucune oeuvre à ce nom` })
    response.json({ message: "Oeuvres trouvées", body: oeuvresTrouvees });
});

route.get("/artistes/:recherche", async function(request, response) {
    const recherche = request.params.recherche;
    console.log(recherche);
    const oeuvresTrouvees = await Oeuvre.find({auteur: {$regex: recherche, $options: 'i'}});
    console.log(oeuvresTrouvees);
    if (!oeuvresTrouvees) return response.status(404).json({ message: `Aucune oeuvre pour cet artiste` })
    response.json({ message: "Oeuvres trouvées", body: oeuvresTrouvees });
});

module.exports = route;