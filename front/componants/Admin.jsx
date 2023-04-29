import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableHighlight } from "react-native-gesture-handler";

const Admin = () => {
  const [users, setUsers] = useState([]);
//   const [email, setEmail] = useState([]);
//   const [password, setPassword] = useState([]);
//   const [role, setRole] = useState([]);

  ///////////

  async function affiche() {
    await fetch("http://10.0.2.2:4004/admin/utilisateurs/")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }

  useEffect(function () {
    affiche();
  }, []);

  ///////////

  // async function supprimerUtilisateur(id) {
  //         console.log("supprimé");
  //       await fetch("http://192.168.1.98:4004/admin/utilisateurs/" + id, {
  //       method: "DELETE"
  //     });

  // }

  //////////

  // let bodyContent = JSON.stringify({
  //         "email" : email,
  //         "password" : password,
  //         "role" : role
  //     });
  //    async function modifierUtilisateur(id) {
  //      let response = await fetch("http://192.168.1.98:4004/admin/utilisateurs/"+id, {
  //           method: "PUT",
  //           body: bodyContent
  //    });
  // }

  /////////////

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.titre}>Gestion des profils</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.affichageView}>
            {/* <View style={styles.affichageView}> */}
              <View>
                <Text style={styles.textCompte1}>ID : {item._id}</Text>
                <Text style={styles.textCompte1}>email : {item.email}</Text>
                <Text style={styles.textCompte1}>Rôle : {item.role}</Text>
              </View>
              <View>
                <TouchableHighlight style={styles.touchable1}>
                    {/* Fonction onPress à ajouter */}
                  <Text style={styles.textTouchable2}>
                    Supprimer ce compte utilisateur            
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchable2}>
                    {/* Fonction onPress à ajouter */}
                  <Text style={styles.textTouchable}>Modifier ce compte utilisateur</Text>
                </TouchableHighlight>
              </View>
            {/* </View> */}
          </View>
        )}
      />
    </View>
  );
};
export default Admin;

const styles = StyleSheet.create({
  affichageView: {
    flex: 1, flexDirection: "row", 
    marginTop: 10, marginLeft: 15,
    alignItems: "center"
  },
  titre: {
    fontSize: 22, textAlign: "center",
    padding: 20,
    borderWidth: 2,
    margin: 10
  },
  touchable1: {
    width: 140,
    backgroundColor: "salmon",
    borderWidth: 1, borderRadius: 15,
    alignItems: "center",
    marginLeft: 10
  },
  touchable2: {
    width: 140,
    backgroundColor: "cornsilk",
    borderWidth: 1, borderRadius: 15,
    alignItems: "center",
    marginLeft: 10
  },
  textTouchable: { 
    fontSize: 15, 
    textAlign: "center" 
  },
  textTouchable2: { 
    fontSize: 15, color: "white", textAlign: "center" 
  },
  textCompte1: { 
    fontSize: 16, textAlign: "right" 
  }
});

// voir tous les profils
// modif l'un deux
// suppr l'un deux
