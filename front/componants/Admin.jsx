import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Admin = ({navigation}) => {

    const [users, setUsers] = useState([]);
    const [modifCompte, setModifCompte] = useState(false);
    const [compteModifie, setCompteModifie] = useState(false);
    const [idCompte, setIdCompte] = useState("");
    const [emailCompte, setEmailCompte] = useState("");
    const [passwordCompte, setPasswordCompte] = useState("");
    const [roleCompte, setRoleCompte] = useState("");
    const [utilisateur, setUtilisateur] = useState({});
    const [messageErreur, setMessageErreur] = useState("");

  ///////////

    async function affiche() {
        await fetch("http://10.0.2.2:4004/admin/utilisateurs/")
        .then((response) => response.json())
        .then((data) => setUsers(data));
    }

    async function supprimerUtilisateur(id) {
        console.log("supprimé");

        let response = await fetch("http://10.0.2.2:4004/admin/utilisateurs/" + id, {
            method: "DELETE"
        });

        let data = await response.json();

        setUtilisateur(data);

        console.log(data, " a été supprimé");
        affiche();
    }

    async function modifierUtilisateur(id) {
        console.log("modification de: " + id);
        console.log("roleCompte: " + roleCompte);
        
        let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
        }
        let lesChamps = JSON.stringify({
        "email" : emailCompte,
        "password" : passwordCompte,
        "role" : roleCompte
        });

        console.log(lesChamps);

        let response = await fetch("http://10.0.2.2:4004/admin/utilisateurs/" + id, { 
        method: "PUT",
        body: lesChamps,
        headers : lesHeaders
        });

        console.log("RESPONSE: ", response);

        let data = await response.json();

        console.log(data, " a été modifié");

        setUtilisateur(data);
        
        if (data.body !== "undefined") { 
            setCompteModifie(true);
            setMessageErreur("");
        }  else {
            setMessageErreur(data.message);
        }

    }

    async function compteAModifier(id, email, role) {
        setModifCompte(true);
        setCompteModifie(false);
        console.log("modification");
        setIdCompte(id);
        setEmailCompte(email);
        setRoleCompte(role); 
    }

    useEffect(function () {
        affiche();
        setMessageErreur("");
    }, []);

    useEffect(function () {
        affiche();
    }, [utilisateur]);

    const roles = ["admin", "rédacteur", "utilisateur"];

  return (
    <View style={{ marginTop: 30, marginBottom: 100 }}>
      <Text style={styles.titre}>Gestion des profils</Text>
        { modifCompte
        ?
        <View>
            <TextInput placeholder="email" onChangeText={(texte) => setEmailCompte(texte)}  style={styles.input} value={emailCompte} />
            <TextInput placeholder="password" onChangeText={(texte) => setPasswordCompte(texte)}  style={styles.input} secureTextEntry={true} /> 
            <SelectDropdown
                data={roles}
                defaultValue={roleCompte}
                onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setRoleCompte(selectedItem);
                console.log(roleCompte);
                }}
                defaultButtonText={'Choisir le rôle'}
                buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
            />
            { messageErreur !== "" &&
            <Text style={styles.alertMessage}>{ messageErreur }</Text>
            }
                <TouchableHighlight style={ styles.touchable }>
                <Text style={styles.btnCourt} onPress={() => { modifierUtilisateur(idCompte); }}>Valider</Text>
            </TouchableHighlight>
            {
                compteModifie &&
                <Text style={{ marginTop: 20, paddingHorizontal: 20 }}>L'utilisateur { JSON.stringify(utilisateur.oldEmail)} a bien été modifié</Text>
            }
            <TouchableHighlight style={ styles.retourGestionProfil }>
                <Button title="Retour" onPress={() => { setModifCompte(false); }} />
            </TouchableHighlight>
        </View>
        :
        <FlatList
            data={users}
            renderItem={({ item }) => (
            <View style={styles.affichageView}>
                <View>
                    <Text style={styles.textCompte1}>ID : {item._id}</Text>
                    <Text style={styles.textCompte1}>email : {item.email}</Text>
                    <Text style={styles.textCompte1}>Rôle : {item.role}</Text>
                </View>
                <View style={styles.buttonsModifDelete}>
                    <TouchableHighlight style={styles.touchable1}>
                    <Text style={styles.textTouchable2} onPress={()=>{supprimerUtilisateur(item._id)}}>
                        Supprimer ce compte utilisateur            
                    </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchable2}>
                    <Text style={styles.textTouchable} onPress={()=>{compteAModifier(item._id, item.email, item.role)}}>Modifier ce compte utilisateur</Text>
                    </TouchableHighlight>
                </View>
            </View>
            )}
            keyExtractor={(item, index) => item._id}
        />
        }
    </View>
  );
};
export default Admin;

const styles = StyleSheet.create({
  affichageView: {
    flex: 1,
    flexDirection: "column", 
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    alignItems: "center"
  },
  buttonsModifDelete: {
    flex: 1,
    flexDirection: "row", 
    marginTop: 10,
  },
  refresh: {
    marginTop: 30,
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center"
  },
  titre: {
    fontSize: 22, textAlign: "center",
    padding: 20,
    borderWidth: 2,
    margin: 10
  },
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
  },
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
  retourGestionProfil: {
    marginTop: 30,
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  btnCourt : {
    fontSize: 18
  },
  dropdown1BtnStyle: {
    width: '80%',
    marginTop : 20,
    marginLeft: "auto",
    marginRight: "auto",
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {
    color: '#444',
    textAlign: 'left'
  },
  dropdown1DropdownStyle: {
    backgroundColor: '#EFEFEF'
  },
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5'
  },
  dropdown1RowTxtStyle: {
    color: '#444',
    textAlign: 'left'
  },
  alertMessage: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    color: "red",
    backgroundColor: "pink"
  }
});

// voir tous les profils
// modif l'un deux
// suppr l'un deux
