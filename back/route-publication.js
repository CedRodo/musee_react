const { Router } = require("express");
const { Oeuvre } = require("./models");
const { autorisation } = require("./middleware");

const route = Router();

route.get("/:id", async function(request, response) {
    const idRedacteur = request.params.id;
    const getOeuvres = await Oeuvre.find({idRedacteur: idRedacteur});
    if (!getOeuvres) return response.status(404).json({ message: `Aucune oeuvre trouvée pour ce rédacteur` })
    response.json({ message: `Les oeuvres publiées par le rédacteur id: ${idRedacteur}`, body: getOeuvres });
});

route.get("/", async function(request, response) {
    const toutesOeuvres = await Oeuvre.find();
    if (!toutesOeuvres) return response.status(404).json({ message: `Aucune oeuvre trouvée` })
    response.json({ message: `Toutes les oeuvres pour le mode Admin`, body: toutesOeuvres});
});

route.post("/", [ autorisation ], async function(request, response) {

    const { body } = request;
    console.log(body);
    const newOeuvre = new Oeuvre({ ...body });
    await newOeuvre.save();
    response.json(newOeuvre);

});

route.delete("/:id", [ autorisation ], async function(request, response) {
    const id = request.params.id;
    const responseMongo = await Oeuvre.findByIdAndRemove(id);
    if (!responseMongo) return response.status(404).json({ message: `L'oeuvre ${id} est introuvable` })
    response.json({ message: `L'oeuvre ${id} a bien été supprimé` });
});

route.put("/:id", [ autorisation ], async function(request, response) {
    const id = request.params.id;
    const { body } = request;
    const oeuvreOldTitle = await Oeuvre.findById(id).select({titre: 1})
    const oeuvreUpdate = await Oeuvre.findByIdAndUpdate(id, {
        $set: body
    });

    if (!oeuvreUpdate) return response.status(404).json({ message: `L'oeuvre ${oeuvreOldTitle.titre} est introuvable` })
    response.json({ message: `L'oeuvre ${oeuvreOldTitle.titre} a bien été modifié` });
});

module.exports = route;