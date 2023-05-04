import { Button, StyleSheet, Text, TextInput, Touchable, View, TouchableWithoutFeedback, TouchableHighlight, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import * as SQLite from "expo-sqlite";
import { useDispatch, useSelector } from "react-redux";

const db = SQLite.openDatabase("demo.sqlite");

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const mode = useSelector((store) => store.reducerLoggue);

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [modeCompte, setModeCompte] = useState("inscription")
  const [show, setShow] = useState(true)
  const [roleAdmin, setRoleAdmin] = useState(false)
  const [roleRedacteur, setRoleRedacteur] = useState(false);
  const [tokenUtilisateur, setTokenUtilisateur] = useState("");

  const [emailCompteModification, setEmailCompteModification] = useState("");
  const [passwordCompteModification, setPasswordCompteModification] = useState("");

  const [idUtilisateurConnecte, setIdUtilisateurConnecte] = useState("");
  const [emailUtilisateurConnecte, setEmailUtilisateurConnecte] = useState("");
  const [roleUtilisateurConnecte, setRoleUtilisateurConnecte] = useState("");

  const [utilisateur, setUtilisateur] = useState({});

  const [messageErreur, setMessageErreur] = useState("");

  useEffect(function() {
    
    db.transaction(function(tx) {
      tx.executeSql(`DROP TABLE IF EXISTS user`,
                  function(transact, resultat) { console.log("La table user a été supprimée");},
                  function(transact, err) { console.log("Erreur lors de la suppression: ", err); })
      })
    db.transaction(function(tx) {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    idUtilisateur VARCHAR(500),
                    email VARCHAR(500),
                    role VARCHAR(500),
                    isAdmin BOOLEAN,
                    isRedacteur BOOLEAN,
                    token VARCHAR(500)
                  )`,
                  [],
                  function(transact, resultat) { console.log("La table user a été créée");},
                  function(transact, err) { console.log("Erreur lors de la création"); })
      })
  }, [])

  function getToken() {
    
    db.transaction(function(tx) {
          tx.executeSql(`SELECT token FROM user WHERE idUtilisateur = ?`,
                      [idUtilisateurConnecte],
                      function(transact, resultat) { console.log("SELECT getToken réussi: ", resultat.rows._array[0]); setTokenUtilisateur(resultat.rows._array[0].token); },
                      function(transact, err) { console.log("SELECT échec", err); })
          });
  }
    

   const enreg = async () => {                                /////////////////
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
      let lesChamps = JSON.stringify({
        "email" : email,  
        "password" : password,
        "role" : "admin"  //<=== ?
      });

      let response = await fetch("http://10.0.2.2:4004/compte", { 
        method: "POST",
        body: lesChamps  ,
        headers : lesHeaders
      });
      
      setShow(true);

      let data = await response.json();
      console.log("INSCRIPTION: ", data);

      if (data.length > 0) {
        dispatch({type: "NONLOGGUE"});
      } else {
        dispatch({type: "LOGGUE"});
        setUtilisateur(data);
        setIdUtilisateurConnecte(data.body._id);
        setEmailUtilisateurConnecte(data.body.email);
        setRoleUtilisateurConnecte(data.body.role);
        setEmailCompteModification(data.body.email);
        setRoleAdmin(utilisateur.isAdmin);
        setRoleRedacteur(utilisateur.isRedacteur);

        db.transaction(function(tx) {
            tx.executeSql(`DELETE FROM user`,
                        [],
                        function(transact, resultat) { console.log(); console.log("SUPPRESSION réussie");},
                        function(transact, err) { console.log("SUPPRESSION échec", err); })
            })

        db.transaction(function(tx) {
            tx.executeSql(`INSERT into user VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [null, data.body._id, data.body.email, data.body.role, roleAdmin, roleRedacteur, data.token],
                        function(transact, resultat) { console.log(db); console.log("INSERT réussi");},
                        function(transact, err) { console.log("INSERT échec", err); })
            })
      }
    }

    const logguage = async () => {                                ///////////////
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
      
      console.log(data);
      
      if (data.length > 0) {
        return dispatch({ type: "NONLOGGUE" });
      } else if (data.message !== "Bienvenue") {
        return setMessageErreur(data.message);
      } else {
        setMessageErreur("");
        setUtilisateur(data);
        setIdUtilisateurConnecte(data.body._id);
        setEmailUtilisateurConnecte(data.body.email);
        setRoleUtilisateurConnecte(data.body.role);
        setEmailCompteModification(data.body.email);
        setRoleAdmin(data.isAdmin);
        setRoleRedacteur(data.isRedacteur);
        dispatch({type: "LOGGUE"});
        console.log(roleAdmin);
        console.log(roleRedacteur);

        db.transaction(function(tx) {
            tx.executeSql(`DELETE FROM user`,
                        [],
                        function(transact, resultat) { console.log(); console.log("SUPPRESSION réussie");},
                        function(transact, err) { console.log("SUPPRESSION échec", err); })
            })

        db.transaction(function(tx) {
            tx.executeSql(`INSERT into user VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [null, data.body._id, data.body.email, data.body.role, roleAdmin, roleRedacteur, data.token],
                        function(transact, resultat) { console.log(db); console.log("INSERT réussi");},
                        function(transact, err) { console.log("INSERT échec", err); })
            })

      }

      console.log("TOKEN: ", data.token);
      
    }

    async function supprimerUtilisateur(id) {
            console.log("supprimé");
            let response = await fetch("http://10.0.2.2:4004/admin/utilisateurs/" + id, {
            method: "DELETE"
        });

        let data = await response.json();

        console.log(data, " a été supprimé");
        deconnexion();
    }

    async function modifierUtilisateur(id) {
        console.log("modification de: " + id);
        
        let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
        }
        let lesChamps = JSON.stringify({
        "email" : emailCompteModification,
        "password" : passwordCompteModification,
        "role" : roleUtilisateurConnecte
        });

        console.log(lesChamps);

        let response = await fetch("http://10.0.2.2:4004/compte/" + id, { 
        method: "PUT",
        body: lesChamps,
        headers : lesHeaders
        });

        console.log("RESPONSE: ", response);

        let data = await response.json();

        console.log(data, " a été modifié");

        if (data.id !== "undefined") {

          getToken();
          console.log("tokenUtilisateur: ", tokenUtilisateur);

          db.transaction(function(tx) {
              tx.executeSql(`UPDATE user SET email = ?, token = ? WHERE idUtilisateur = ?`,
                          [data.body.email, tokenUtilisateur, idUtilisateurConnecte],
                          function(transact, resultat) { console.log(db); console.log("UPDATE réussi");},
                          function(transact, err) { console.log("UPDATE échec", err); })
              })
          setEmailUtilisateurConnecte(emailCompteModification);
          setModeCompte("");
        } 

        setUtilisateur(data);

    }

    function deconnexion(){
      dispatch({type: "NONLOGGUE"})
      setModeCompte("")
      setShow(true)
      setPassword("")
      setRoleAdmin(false)
      setRoleRedacteur(false)
      navigation.navigate("Accueil")
    }


    return (
      <ImageBackground source={{uri : "https://i.imgur.com/CmoGAWk.jpeg"}} style={{width: '100%', height: '100%'}}>
<View style={{paddingTop : 40}}> 
  { mode.statusLoggue == false
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
            <TouchableHighlight onPress={enreg} style={ styles.touchable }>
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
            <TouchableHighlight onPress={() => {logguage(); }} style={ styles.touchable }>
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
      <TextInput placeholder="email" onChangeText={(texte) => setEmailCompteModification(texte)}  style={styles.input} value={emailCompteModification}  />
      <TextInput placeholder="password" onChangeText={(texte) => setPasswordCompteModification(texte)}  style={styles.input} secureTextEntry={true} />
      <TouchableHighlight onPress={() => {modifierUtilisateur(idUtilisateurConnecte); }} style={ styles.touchable }>
        <Text style={styles.btnCourt}>Valider</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => {setShow(true); setModeCompte("")} } style={ styles.touchable }>
      <Text style={styles.btnCourt}>Retour</Text>
      </TouchableHighlight>
    </View>
    :
    <View>
      <Text style={styles.titre}>Bienvenue, {emailUtilisateurConnecte}!</Text> 
      <TouchableHighlight onPress={deconnexion} style={ styles.touchable2 }>
         <Text style={styles.btnCourt}>Se déconnecter</Text>
      </TouchableHighlight>
      <TouchableHighlight style={ styles.touchable2 }>
          <Text style={{fontSize: 18, textAlign : "center"}} onPress={()=>{ supprimerUtilisateur(idUtilisateurConnecte)} }>Supprimer mon compte</Text>
      </TouchableHighlight>
      <TouchableHighlight style={ styles.touchable2 }>
          <Text style={{fontSize: 18, textAlign : "center"}} onPress={()=>{ 
        setModeCompte("modification");} }>Modifier mon compte</Text>
      </TouchableHighlight>
      { roleAdmin &&
      <View>
        <TouchableHighlight style={ styles.touchable2} onPress={() => {navigation.navigate("Admin")}}>
        <Text style={styles.btnCourt}>Gestion des profils</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.touchable2 }>
        <Text style={styles.btnCourt}>Publication</Text>
        </TouchableHighlight>
      </View>
      }
      { roleRedacteur &&
      <View>
      <TouchableHighlight style={ styles.touchable2 }>
        <Text style={styles.btnCourt}>Publication</Text>
      </TouchableHighlight>
      </View>
    }
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
  btnCourt : {
    fontSize: 18
  },
  alertMessage: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    color: "red",
    backgroundColor: "pink"
  }
  
})

