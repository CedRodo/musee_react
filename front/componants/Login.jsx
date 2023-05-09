import { StyleSheet, Text, TextInput, View, TouchableHighlight, ImageBackground } from 'react-native'
import React, { useState, useContext } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ProfilContext } from '../contexts/profilContext';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("demo.sqlite");

const Login = ({navigation}) => {

  const dispatch = useDispatch();
  const isLogged = useSelector((store) => store.reducerLoggue);
  const isRole = useSelector((store) => store.reducerIsRole);
  const { monProfil, monProfilLogin, monProfilLogout } = useContext(ProfilContext);

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [modeCompte, setModeCompte] = useState("inscription");
  const [show, setShow] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [tokenUtilisateur, setTokenUtilisateur] = useState("");

  const [emailCompteModification, setEmailCompteModification] = useState("");
  const [passwordCompteModification, setPasswordCompteModification] = useState("");

  const [idUtilisateurConnecte, setIdUtilisateurConnecte] = useState("");
  const [emailUtilisateurConnecte, setEmailUtilisateurConnecte] = useState("");
  const [roleUtilisateurConnecte, setRoleUtilisateurConnecte] = useState("");

  const [messageErreur, setMessageErreur] = useState("");

  function getToken() {
    
    db.transaction(function(tx) {
          tx.executeSql(`SELECT * FROM user`,
                      [],
                      function(transact, resultat) { console.log("SELECT getToken réussi: ", resultat.rows._array[0]); setTokenUtilisateur(resultat.rows._array[0].token); },
                      function(transact, err) { console.log("SELECT échec", err); })
          });

  }
    

   const enreg = async () => {
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
      let lesChamps = JSON.stringify({
        "email" : email,  
        "password" : password,
        "role" : "utilisateur"
      });

      let response = await fetch("http://10.0.2.2:4004/compte", { 
        method: "POST",
        body: lesChamps  ,
        headers : lesHeaders
      });

      let data = await response.json();

      setMessageErreur("");
      setIdUtilisateurConnecte("");
      setEmailUtilisateurConnecte("");
      setRoleUtilisateurConnecte("");
      setEmailCompteModification("");

      if (data.length > 0) {

        dispatch({type: "NONLOGGUE"});

      } else if (data.message !== "Le compte a été créé") {

        return setMessageErreur(data.message);

      } else {      

        setShow(true);
        setShowDelete(false);
        logguage();

      }

    }

    const logguage = async () => {  
      
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }

      let lesChamps = JSON.stringify({
        "email" : email, 
        "password" : password
      });

      let response = await fetch("http://10.0.2.2:4004/connexion", { 
        method: "POST",
        body: lesChamps,
        headers : lesHeaders
      }); 

      let data = await response.json();
      
      if (data.length > 0) {

        return dispatch({ type: "NONLOGGUE" });

      } else if (data.message !== "Bienvenue") {

        return setMessageErreur(data.message);

      } else {

        setMessageErreur("");
        setShowDelete(false);
        setIdUtilisateurConnecte(data.body._id);
        monProfil.id = data.body._id;
        setEmailUtilisateurConnecte(data.body.email);
        monProfil.email = data.body.email;
        setRoleUtilisateurConnecte(data.body.role);
        setEmailCompteModification(data.body.email);
        
        data.isAdmin ? dispatch({type: "isAdminTrue"}) : dispatch({type: "isAdminFalse"});
        data.isRedacteur ? dispatch({type: "isRedacteurTrue"}) : dispatch({type: "isRedacteurFalse"});
        dispatch({type: "LOGGUE"});
    
        db.transaction(function(tx) {
          tx.executeSql(`DROP TABLE IF EXISTS user`,
                      function(transact, resultat) { console.log("La table user a été supprimée");},
                      function(transact, err) { console.log("Erreur lors de la suppression: ", err); })
          })

        db.transaction(function(tx) {
          tx.executeSql(`CREATE TABLE IF NOT EXISTS user (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        token VARCHAR(500)
                      )`,
                      [],
                      function(transact, resultat) { console.log("La table user a été créée");},
                      function(transact, err) { console.log("Erreur lors de la création"); })
            })

        db.transaction(function(tx) {
            tx.executeSql(`INSERT into user VALUES (?, ?)`,
                        [null, data.token],
                        function(transact, resultat) { console.log(db); console.log("INSERT réussi");},
                        function(transact, err) { console.log("INSERT échec", err); })
            })

      }

      setTokenUtilisateur(data.token);
      monProfil.token = data.token
      
    }

    async function supprimerUtilisateur(id) {

      getToken();
      
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "token": monProfil.token
      }

      let response = await fetch("http://10.0.2.2:4004/admin/utilisateurs/" + id, {
        method: "DELETE",
        headers : lesHeaders
      });

      let data = await response.json();

      deconnexion();
      navigation.navigate("Accueil");

    }

    async function modifierUtilisateur(id) {

      getToken();
      
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "token": monProfil.token
      }

      let lesChamps = JSON.stringify({
        "email" : emailCompteModification,
        "password" : passwordCompteModification,
        "role" : roleUtilisateurConnecte
      });

      let response = await fetch("http://10.0.2.2:4004/compte/" + id, { 
        method: "PUT",
        body: lesChamps,
        headers : lesHeaders
      });

      let data = await response.json();

      if (data.id !== "undefined") {

        setEmailUtilisateurConnecte(emailCompteModification);
        setModeCompte("");
        setShowDelete(false);
        deconnexion();
        navigation.navigate("Mon compte");

      } 

    }

    function deconnexion(){

      dispatch({type: "NONLOGGUE"});
      setModeCompte("");
      setShow(true);
      setShowDelete(false);
      setPassword("");
      dispatch({type: "isAdminFalse"});
      dispatch({type: "isRedacteurFalse"});

    }


    return (
      <ImageBackground source={{uri : "https://i.imgur.com/CmoGAWk.jpeg"}} style={{width: '100%', height: '100%'}}>
<View style={{paddingTop : 40}}> 
  { isLogged.statusLoggue == false
    ?
      show
        ? 
        <View>
          <TouchableHighlight onPress={() => {
            setShow(!show);
            setModeCompte("inscription");
           }} style={{backgroundColor: "lightblue", width : 170, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 250}}>
             <Text style={styles.btnCourt}>S'enregistrer</Text>
          </TouchableHighlight> 
          <TouchableHighlight onPress={() => {
            setShow(!show);
            setModeCompte("connexion");
          }} style={ styles.touchable2 }>
           <Text style={styles.btnCourt}>S'identifier</Text>
          </TouchableHighlight>

        </View>
        :
        <View>
          { modeCompte == "inscription" &&
          <View>
            <Text style={styles.titre}>Inscription</Text>
            <TextInput placeholder="email" onChangeText={(duTexte) => setEmail(duTexte)}  style={styles.input}  />
            <TextInput placeholder="password" onChangeText={(duTexte) => setPassword(duTexte)}  style={styles.input}secureTextEntry={true} />
            { messageErreur !== "" &&
            <Text style={styles.alertMessage}>{ messageErreur }</Text>
            }
            <TouchableHighlight onPress={enreg} style={ styles.touchable3 }>
              <Text style={styles.btnCourt}>Valider</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => {setShow(true)} } style={ styles.touchable }>
              <Text style={styles.btnCourt}>Retour</Text>
            </TouchableHighlight>
          </View>
          }
          { modeCompte == "connexion" &&
          <View>
            <Text style={styles.titre}>Connexion</Text>
            <TextInput placeholder="email" onChangeText={(duTexte) => setEmail(duTexte)}  style={styles.input}  />
            <TextInput placeholder="password" onChangeText={(duTexte) => setPassword(duTexte)}  style={styles.input}secureTextEntry={true} />
            { messageErreur !== "" &&
            <Text style={styles.alertMessage}>{ messageErreur }</Text>
            }
            <TouchableHighlight onPress={() => {logguage(); }} style={ styles.touchable3 }>
              <Text style={styles.btnCourt}>Valider</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => {setShow(true); setMessageErreur("");} } style={ styles.touchable }>
            <Text style={styles.btnCourt}>Retour</Text>
            </TouchableHighlight>
          </View>
          }
        </View>

    :
    
    modeCompte == "modification"

    ?
    <View>
      <Text style={styles.titre}>Modification</Text>
      <Text style={styles.oldEmail}>{emailUtilisateurConnecte}</Text>
      <TextInput placeholder="email" onChangeText={(texte) => setEmailCompteModification(texte)}  style={styles.input} value={emailCompteModification}  />
      <TextInput placeholder="password" onChangeText={(texte) => setPasswordCompteModification(texte)}  style={styles.input} secureTextEntry={true} />
      <TouchableHighlight onPress={() => {modifierUtilisateur(idUtilisateurConnecte); }} style={ styles.touchable3 }>
        <Text style={styles.btnCourt}>Valider</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => {setShow(true); setModeCompte("")} } style={ styles.touchable }>
      <Text style={styles.btnCourt}>Retour</Text>
      </TouchableHighlight>
    </View>
    :
    <View>
      <Text style={styles.titre}>Bienvenue, { monProfil.email }!</Text> 
      <TouchableHighlight onPress={ () => { deconnexion(); navigation.navigate("Mon compte"); } } style={ styles.touchable2 }>
         <Text style={styles.btnCourt}>Se déconnecter</Text>
      </TouchableHighlight>
      <TouchableHighlight style={ styles.touchable2 }>
          <Text style={{fontSize: 18, textAlign : "center"}} onPress={()=>{ setShowDelete(true); }}>Supprimer mon compte</Text>
      </TouchableHighlight>
      { showDelete &&
      <TouchableHighlight style={ styles.touchableGros }>
          <Text style={{fontSize: 18, textAlign : "center", color : "white"}} onPress={()=>{ supprimerUtilisateur(idUtilisateurConnecte); }}>Confirmer la suppression de votre compte ?</Text>
      </TouchableHighlight>
      }
      <TouchableHighlight style={ styles.touchable2 }>
          <Text style={{fontSize: 18, textAlign : "center"}} onPress={()=>{ 
        setModeCompte("modification"); } }>Modifier mon compte</Text>
      </TouchableHighlight>
      <View>
      { isRole.isAdmin &&
      <>
        <TouchableHighlight style={ styles.touchable2} onPress={() => {navigation.navigate("Admin")}}>
        <Text style={styles.btnCourt}>Gestion des profils</Text>
        </TouchableHighlight>
      </>
      }
      { (isRole.isAdmin || isRole.isRedacteur) &&
      <>
        <TouchableHighlight style={ styles.touchable2 } onPress={() => {navigation.navigate("Publication")}}>
        <Text style={styles.btnCourt}>Publication</Text>
        </TouchableHighlight>
      </>
      }
      </View>
    
    </View>
  }
   </View>
   </ImageBackground>
   )
};


export default Login

const styles = StyleSheet.create({

  input : {
    backgroundColor : "white",
    fontSize : 18,
    padding : 7,
    marginLeft : 20,
    marginRight : 20,
    marginTop : 20,
    borderWidth : 1,
    borderColor : "black"
  },
  touchableGros : {
    backgroundColor: "red",
    width : 170,
    height: 100,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
    paddingHorizontal: 10
  },
  titre : {fontSize : 24, textAlign: "center"},
  touchable : {
    backgroundColor: "lightblue",
    width : 120,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30
  },
  refresh: {
    marginTop: 30,
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center"
  },
  touchable2 : {
    backgroundColor: "lightblue",
    width : 170,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30
  },
  touchable3 : {
    backgroundColor: "skyblue",
    width : 120,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30
  },
  btnCourt : {
    fontSize: 18
  },
  alertMessage: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    color: "red",
    backgroundColor: "pink"
  },
  oldEmail: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 18,
    color: "blue",
    backgroundColor: "beige"
  }
  
})

