const { Router } = require("express");
const { Utilisateur } = require("./models");
const { isValidObjectId } = require("mongoose");
const { isAdmin } = require("./middleware");

const route = Router();

route.get("/utilisateurs/", async function(request, response) {

    const getAllUtilisateurs = await Utilisateur.find().select({ _id: 1, email: 1, role: 1 });

    if (!getAllUtilisateurs) return response.status(404).json({ message: `Aucun utilisateur trouvé` })

    console.log(getAllUtilisateurs);

    response.json(getAllUtilisateurs);

});

route.get("/utilisateurs/:id", async function(request, response) {
    
    const id = request.params.id;

    if (!isValidObjectId(id)) return response.status(400).json({ message: `L'Id ${id} n'est pas valide`});

    const getUtilisateur = await Utilisateur.findById(id).select({ _id: 1, email: 1, role: 1 });

    console.log(getUtilisateur);

    response.json(getUtilisateur);

});

route.delete("/utilisateurs/:id", async function(request, response) {
    
    const id = request.params.id;

    if (!isValidObjectId(id)) return response.status(400).json({ message: `Profil introuvable (${id})`});
    const getUtilisateur = await Utilisateur.findById(id);
    await Utilisateur.findByIdAndRemove(id);

    response.json({ message: `Le compte ${getUtilisateur.email} a bien été supprimé`});

});

route.put("/utilisateurs/:id", [isAdmin], async function(request, response) {
    
    const id = request.params.id;
    const { body } = request;
    const utilisateurUpdate = await Utilisateur.findByIdAndUpdate(id, {
        $set: body
    }, { new: true }); // { new: true } facultatif : permet de récupérer

    if (!utilisateurUpdate) return response.status(404).json({ message: `L'utilisateur ${id} est introuvable` })
    response.json({ message: `L'utilisateur ${id} a bien été modifié` });

});

module.exports = route;