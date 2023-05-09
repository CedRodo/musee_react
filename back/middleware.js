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

    const token = request.headers.token;
    console.log("token: ", token);
    
    if (!token) return response.status(401).json({ message: "Vous devez avoir un token JWT pour réaliser cette opération"});    

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        request.user = payload;
        console.log("USER: ", request.user);
        next();
    }
    catch {
        response.status(400).json({ message: "JWT invalide"});
    }
}

async function passwordToSend(request, response, next) {
    
    const { body } = request;
    const id = request.params.id;
    const getUtilisateur = await Utilisateur.findById(id);
    request.email = getUtilisateur.email;
    if (body.password == "" || body.password == "undefined" || body.password == null) {
        body.password = getUtilisateur.password;
    } else {
        const salt = await genSalt(10);
        body.password = await hash(body.password, salt);
    }
    next();
}

module.exports.idValid = idValid;
module.exports.isValidOeuvre = isValidOeuvre;
module.exports.isValidCompte = isValidCompte;
module.exports.autorisation = autorisation;
module.exports.passwordToSend = passwordToSend;