const { isValidObjectId } = require("mongoose");
const { schemaUtilisateurJoi } = require("./verifs");
const { genSalt, hash } = require("bcrypt");
const { Utilisateur } = require("./models");
const JWT = require("jsonwebtoken");

function idValid(request, response, next) {
    const id = request.params.id;
    if (!isValidObjectId(id)) return response.status(400).json({ message: `L'Id ${id} n'est pas valide`});
    next();
}

function isValidOeuvre(request, response, next) {
    const { body } = request;
    const { error } = schemaOeuvreJoi.validate(body, { abortEarly: false });
    if (error) return response.status(400).json(error.details);
    next();
}

function isValidCompte(request, response, next) {
    const { body } = request;
    const { error } = schemaUtilisateurJoi.validate(body, { abortEarly: false });
    if (error) return response.status(400).json(error.details);
    next();
}

async function autorisation(request, response, next) {   
    // const token = request.header("x-token");

    const token = request.headers.token;
    console.log("token: ", token);
    
    if (!token) return response.status(401).json({ message: "Vous devez avoir un token JWT pour réaliser cette opération"});    

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        console.log("PAYLOAD: ", payload);
        request.user = payload;
        console.log("USER: ", request.user);
        next();
    }
    catch {
        response.status(400).json({ message: "JWT invalide"});
    }
}

function isAdmin(request, response, next) {
    // if(request.user.role !== "admin") return response(403).json({ message: "vous n'avez pas les droits pour effectuer cette action"})
    console.log("isAdmin !!!!!!!!!");
    next();
}

function isRedacteur(request, response, next) {
    if(request.user.role !== "rédacteur" || request.user.role !== "admin") return response(403).json({ message: "vous n'avez pas les droits pour effectuer cette action"})
    next();
}

async function passwordToSend(request, response, next) {
    
    const { body } = request;
    console.log("BODY du compte à modifier: ", body);
    const id = request.params.id;
    console.log("ID du compte à modifier: ", id);
    const getUtilisateur = await Utilisateur.findById(id);
    console.log("getUtilisateur: ", getUtilisateur);
    request.email = getUtilisateur.email;
    if (body.password == "" || body.password == "undefined" || body.password == null) {
        console.log("Le mot de passe est le même");
        body.password = getUtilisateur.password;
    } else {
        console.log("Le mot de passe a été modifié");
        const salt = await genSalt(10);
        body.password = await hash(body.password, salt);
    }
    console.log("newPassword: ", body.password);
    next();
}

module.exports.idValid = idValid;
module.exports.isValidOeuvre = isValidOeuvre;
module.exports.isValidCompte = isValidCompte;
module.exports.autorisation = autorisation;
// module.exports.getToken = getToken;
module.exports.isAdmin = isAdmin;
module.exports.isRedacteur = isRedacteur;
module.exports.passwordToSend = passwordToSend;