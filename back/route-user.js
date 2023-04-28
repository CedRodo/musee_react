const { Router } = require("express");
const { Utilisateur } = require("./models");
const { isValidObjectId } = require("mongoose");
const { schemaUtilisateurJoi } = require("./verifs");
const { genSalt, hash } = require("bcrypt");


const route = Router();

// CRÉATION DE COMPTE

route.post("/", async function(request, response) {

    const { body } = request;
    const { error } = schemaUtilisateurJoi.validate(body, { abortEarly: false });
    if (error) return response.status(400).json(error.details);

    const utilisateurRecherche = await Utilisateur.find({ email: body.email });

    if (utilisateurRecherche.length > 0) return response.status(400).json({ message: "L'email est déjà pris"});

    const salt = await genSalt(10);

    const passwordHash = await hash(body.password, salt);

    const newUtilisateur = new Utilisateur( { ...body, role: "utilisateur", password: passwordHash });
    await newUtilisateur.save();
    response.json({ message: "Le compte a été créé."});

});

// SUPPRESSION DE COMPTE

route.delete("/:id", async function(request, response) {

    const id = request.params.id;
    if (!isValidObjectId(id)) return response.status(400).json({ message: `Profil introuvable (${id})`});
    const user = await Utilisateur.findById(id);
    await Utilisateur.findByIdAndRemove(id);

    response.json({ message: `Le compte ${user.email} a bien été supprimé`});

});

// MODIFICATION DE COMPTE

route.put("/:id", async function(request, response) {

    const { body } = request;
    const { error } = schemaUtilisateurJoi.validate(body, { abortEarly: false });
    if (error) return response.status(400).json(error.details);

    const id = request.params.id;
    if (!isValidObjectId(id)) return response.status(400).json({ message: `Profil introuvable (${id})`});
    const user = await Utilisateur.findById(id);

    const salt = await genSalt(10);

    const passwordHash = await hash(body.password, salt);

    const userUpdate = await Utilisateur.findByIdAndUpdate(id, {
        $set: body, password: passwordHash
    });

    if (!userUpdate) return response.status(404).json({ message: `L'utilisateur ${user._id} est introuvable` })
    response.json({ message: `Le compte ${user.email} a été modifié.`});

});

// AFFICHAGE DE COMPTE

route.get("/:id", async function(request, response) {

    const id = request.params.id;
    if (!isValidObjectId(id)) return response.status(400).json({ message: `L'Id ${id} n'est pas valide`});
    const getUtilisateur = await Utilisateur.findById(id);

    response.json(getUtilisateur);

});


module.exports = route