const { isValidObjectId } = require("mongoose");
const { schemaOeuvreJoi } = require("./verifs");
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

async function autorisation(request, response, next) {   
    // const token = request.header("x-token");

    const token = request.cookies['token'];
    console.log("token: ", token);
    
    if (!token) return response.status(401).json({ message: "Vous devez avoir un token JWT pour réaliser cette opération"});    

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        console.log("PAYLOAD: ", payload);
        request.user = payload;
        console.log("USER: ", request.utilisateur);
        next();
    }
    catch {
        response.status(400).json({ message: "JWT invalide"});
    }
}

function isAdmin(request, response, next) {
    if(request.utilisateur.role !== "admin") return response(403).json({ message: "vous n'avez pas les droits pour effectuer cette action"})
    next();
}

function isRedacteur(request, response, next) {
    if(request.utilisateur.role !== "redacteur" || request.utilisateur.role !== "admin") return response(403).json({ message: "vous n'avez pas les droits pour effectuer cette action"})
    next();
}

module.exports.idValid = idValid;
module.exports.isValidOeuvre = isValidOeuvre;
module.exports.autorisation = autorisation;
// module.exports.getToken = getToken;
module.exports.isAdmin = isAdmin;
module.exports.isRedacteur = isRedacteur;