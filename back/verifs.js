const Joi = require("joi");

const schemaUtilisateurJoi = Joi.object({
    email: Joi.string().email({ tlds: { allow: false }}).required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required(),
    role: Joi.string().valid("utilisateur", "rédacteur", "admin").required()
});

const schemaLogin = Joi.object({
    email: Joi.string().email({ tlds: { allow: false }}).required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required()
});

const schemaOeuvreJoi = Joi.object({
    titre: Joi.string().min(5).max(255).required(),
    type: Joi.string().min(5).max(255).required(),
    auteur: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(1000).required(),
    image: Joi.string().min(5).max(255).required(),
    imageUrl: Joi.string().min(5).max(255).required(),
    date_oeuvre: Joi.date().required(),
    date_publication: Joi.date().required(),
    date_modification: Joi.date()
});

module.exports.schemaUtilisateurJoi = schemaUtilisateurJoi;
module.exports.schemaOeuvreJoi = schemaOeuvreJoi;
module.exports.schemaLogin = schemaLogin;
