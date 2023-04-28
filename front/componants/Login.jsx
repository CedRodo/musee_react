import { Button, StyleSheet, Text, TextInput, Touchable, View, TouchableWithoutFeedback, TouchableHighlight, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import * as SQLite from "expo-sqlite";


const db = SQLite.openDatabase("demo.sqlite");

const Login = ({navigation}) => {
  // function authentifier(){
  //   const identifiants = {
  //     email : email ,
  //     password : password,
  //     role : role
  //   }
  // }

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [estLoggue, setEstLoggue] = useState(false)
  const [modeCompte, setModeCompte] = useState("inscription")
  const [show, setShow] = useState(true)
  const [roleAdmin, setRoleAdmin] = useState(false)
  const [roleRedacteur, setRoleRedacteur] = useState(false)
  const [tokenUtilisateur, setTokenUtilisateur] = useState("");

  useEffect(function() {
    db.transaction(function(tx) {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    token VARCHAR(500)
                   )`,
                   [],
                   function(transact, resultat) { console.log("La table tokens a été créée");},
                   function(transact, err) { console.log("Erreur lors de la création"); })
      })
  }, [])

  function getToken() {
    db.transaction(function(tx) {
          tx.executeSql(`SELECT * FROM tokens`,
                      [],
                      function(transact, resultat) { console.log(resultat.rows._array[0].token); setTokenUtilisateur(resultat.rows._array[0].token); },
                      function(transact, err) { console.log("SELECT échec", err); })
          });
          console.log("SELECT réussi : ", tokenUtilisateur); 
  }
    

   const enreg = async () => {                                /////////////////
      let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
      let lesChamps = JSON.stringify({
        "email" : email,  // <== Il devrait me renvoyer "déjà créé"
        "password" : password,
        "role" : "admin"  // pour le test
      });

      let response = await fetch("http://10.0.2.2:4004/compte", { 
        method: "POST",
        body: lesChamps  ,
        headers : lesHeaders
      });
   //   console.log(response);      
      setEstLoggue(true) 
      setShow(true);
      let data = await response.text();
      console.log(data);

      data.length > 0
      ? 
      setEstLoggue(false) 
      : 
      setEstLoggue(true)
    }

    const suppr = async () => {   
        getToken();
                                /////////////////
      // let response = await fetch("http://10.0.2.2:4004/compte/", { //+ id
      //   method: "DELETE"
      // });   

      // let data = await response.text();
      // console.log(data);
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
 //     console.log(response);      

      let data = await response.json();
    //  let data2 = await response.status();
      console.log(data);
    //  console.log(data.length);
      if (data.length > 0) {
        return setEstLoggue(false);
      } else {
        if (data.isAdmin == true) setRoleAdmin(true);
        if (data.isRedacteur == true) setRoleRedacteur(true);
        setEstLoggue(true);
      }

      console.log("TOKEN: ", data.token);

      db.transaction(function(tx) {
          tx.executeSql(`DELETE FROM tokens`,
                      [],
                      function(transact, resultat) { console.log(); console.log("SUPPRESSION réussie");},
                      function(transact, err) { console.log("SUPPRESSION échec", err); })
          })

      db.transaction(function(tx) {
          tx.executeSql(`INSERT into tokens VALUES (?, ?)`,
                      [null, data.token],
                      function(transact, resultat) { console.log(db); console.log("INSERT réussi");},
                      function(transact, err) { console.log("INSERT échec", err); })
          })

      // }
     // console.log("Suis-je loggué ?", estLoggue)
     //navigation.navigate("Accueil")
      // alert("LOGGUE")
    }

   

    function deconnexion(){
      setEstLoggue(false)
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
  { estLoggue == false
    ?
      show
        ? 
        <View>
          <TouchableHighlight onPress={() => {
            //enreg();
            setShow(!show);
            setModeCompte("inscription");
           }} style={{backgroundColor: "lightblue", width : 170, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 250}}>
             <Text style={styles.btnCourt}>S'enregistrer</Text>
          </TouchableHighlight> 
          <TouchableHighlight onPress={() => {
            //enreg();
            setShow(!show);
            setModeCompte("connexion");
          }} style={ styles.touchable2 }>
           <Text style={styles.btnCourt}>S'identifier</Text>
          </TouchableHighlight>

        </View>
        :
        <View>
              {modeCompte == "inscription"
              ?
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
              :
              modeCompte == "connexion"
              ?
              <View>
                <Text style={styles.titre}>Connexion</Text>
                <TextInput placeholder="email" onChangeText={(duTexte) => setEmail(duTexte)}  style={styles.input}  />
                <TextInput placeholder="password" onChangeText={(duTexte) => setPassword(duTexte)}  style={styles.input}secureTextEntry={true} />
                <TouchableHighlight onPress={() => {logguage(); }} style={ styles.touchable }>
                  <Text style={styles.btnCourt}>Valider</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {setShow(true)} } style={ styles.touchable }>
                <Text style={styles.btnCourt}>Retour</Text>
                </TouchableHighlight>
              </View>
              :
              <View></View>
              }

            {/* <TextInput placeholder='role' /> */}
          </View>



    :
    <View>
      <Text style={styles.titre}>Je suis sur mon compte !</Text> 
      <TouchableHighlight onPress={deconnexion} style={ styles.touchable2 }>
         <Text style={styles.btnCourt}>Se déconnecter</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={suppr} style={ styles.touchable2 }>
          <Text style={{fontSize: 18, textAlign : "center"}}>Supprimer mon compte</Text>
      </TouchableHighlight>
      {roleAdmin
      ?
      <View>
        <TouchableHighlight style={ styles.touchable2} onPress={() => {navigation.navigate("Admin")}}>
        <Text style={styles.btnCourt}>Gestion des profils</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.touchable2 }>
        <Text style={styles.btnCourt}>Publication</Text>
        </TouchableHighlight>
      </View>
      :
      roleRedacteur
      ?
      <View>
      <TouchableHighlight style={ styles.touchable2 }>
        <Text style={styles.btnCourt}>Publication</Text>
      </TouchableHighlight>
      </View>
      :
      <></>
      }
    </View>
  }
   </View>
   </ImageBackground>
   )
};


export default Login

const styles = StyleSheet.create({
  input : { backgroundColor : "white", fontSize : 18, padding : 7 , marginLeft : 20, marginRight : 20, marginTop : 20,
   borderWidth : 1 , borderColor : "black"},
  titre : {fontSize : 24, textAlign: "center"},
  touchable : {backgroundColor: "lightblue", width : 120, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 30},
  touchable2 : {backgroundColor: "lightblue", width : 170, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 30},
  btnCourt : {fontSize: 18},
  
})

