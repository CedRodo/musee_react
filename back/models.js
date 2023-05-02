const { Schema, model, Types } = require ("mongoose");

const oeuvreSchema = new Schema({
    titre: String,
    type: String,
    auteur: String,
    description: String,
    imageUrl: String,
    date_oeuvre: Date,
    date_publication: {type: Date, default: Date.now},
    date_modification: {type: Date, default: null},
});

const Oeuvre = model("oeuvres", oeuvreSchema);

const utilisateurSchema = new Schema({
    email: String,
    password: String,
    role: { type: String, enum: ["utilisateur", "rédacteur", "admin"], default: "utilisateur" }
});

const Utilisateur = model("utilisateurs", utilisateurSchema);

const PublicationSchema = new Schema({
    utilisateurId: { type: Types.ObjectId, ref: "utilisateurs" },
    oeuvreId: { type: Types.ObjectId, ref: "oeuvres" }
});

const Publication = model("publications", PublicationSchema);

const tokenSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "users" },
    token: String
});

const Token = model("token", tokenSchema);

module.exports.Oeuvre = Oeuvre;
module.exports.Utilisateur = Utilisateur;
module.exports.Publication = Publication;
module.exports.Token = Token;