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
    response.json(toutesOeuvres);
});

route.post("/", async function(request, response) {

    const { body } = request;
    console.log(body);
    const newOeuvre = new Oeuvre({ ...body });
    await newOeuvre.save();
    response.json(newOeuvre);

});

route.delete("/:id", async function(request, response) {
    const id = request.params.id;
    const responseMongo = await Oeuvre.findByIdAndRemove(id);
    if (!responseMongo) return response.status(404).json({ message: `L'oeuvre ${id} est introuvable` })
    response.json({ message: `L'oeuvre ${id} a bien été supprimé` });
});

route.put("/:id", async function(request, response) {
    const id = request.params.id;
    const { body } = request;
    const oeuvreUpdate = await Oeuvre.findByIdAndUpdate(id, {
        $set: body
    });

    if (!oeuvreUpdate) return response.status(404).json({ message: `L'oeuvre ${id} est introuvable` })
    response.json({ message: `L'oeuvre ${id} a bien été modifié` });
});

module.exports = route;