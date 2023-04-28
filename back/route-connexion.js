const { Router } = require("express");
const { schemaLogin } = require("./verifs");
const { Utilisateur } = require("./models");
const { compare } = require("bcrypt");
const JWT = require("jsonwebtoken");

const route = Router();

route.post("/connexion", async (request, response) => {

    const { body } = request;

    const { error } = schemaLogin.validate(body, { abortEarly: false });
    if (error) return response.status(400).json(error.details);

    const getUtilisateur = await Utilisateur.findOne({ email: body.email });

    if (!getUtilisateur) return response.status(404).json({ message: "Aucun profil avec cette email"});

    const checkPass = await compare(body.password, getUtilisateur.password);

    if (!checkPass) return response.status(400).json({ message: "Le mot de passe entré est incorrect"});

    const profilSansPass = {
        _id: getUtilisateur._id,
        email: getUtilisateur.email,
        role: getUtilisateur.role ? getUtilisateur.role : "visiteur"
    }

    const token = JWT.sign(profilSansPass, process.env.JWT_SECRET);

    // response.header("x-token", token)
    //     .header("access-control-expose-headers" , "x-token");
    let admin = false;
    let redacteur = false;
    if (getUtilisateur.role == "admin") admin = true;
    if (getUtilisateur.role == "redacteur") redacteur = true;

    response.json({ message: "Bienvenue", token: token, isAdmin: admin, isRedacteur: redacteur });
});

module.exports = route;