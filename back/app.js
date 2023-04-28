const express = require("express");
const routeAccueil = require("./route");
const routeCollection = require("./route-collections");
const routeAdmin = require("./route-admin");
const routeUser = require("./route-user");
const routeConnexion = require("./route-connexion");
const routePublication = require("./route-publication");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const URI = process.env.NODE_ENV === "production" ? process.env.BDD_PROD : process.env.BDD_DEV;
console.log(URI);

connect(URI)
    .then(() => console.log("Connexion à mongoDB réussie"))
    .catch((ex) => console.log(ex))


const PORT = 4004;

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true })); // récupère les informations d'un formulaire

// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(routeAccueil);
app.use("/collections", routeCollection);
app.use("/admin", routeAdmin);
app.use("/publication", routePublication);
app.use("/compte", routeUser);
app.use(routeConnexion);



app.listen(PORT, () => console.log(`express start sur port ${PORT}`));