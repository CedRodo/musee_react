import { StyleSheet, Text, View, FlatList, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Publication = ({navigation}) => {

    const [oeuvres, setOeuvres] = useState([]);
    const [modifOeuvre, setModifOeuvre] = useState(false);
    const [oeuvreModifie, setOeuvreModifiee] = useState(false);
    const [show, setShow] = useState(true);
    const [retour, setRetour] = useState(false);

    const [oeuvreTitreAModifier, setOeuvreTitreAModifier] = useState("");
    const [oeuvreAuteurAModifier, setOeuvreAuteurAModifier] = useState("");
    const [oeuvreDateCreationAModifier, setOeuvreDateCreationAModifier] = useState("");
    const [oeuvreDatePublicationAModifier, setOeuvreDatePublicationAModifier] = useState(0);
    const [oeuvreDateModificationAModifier, setOeuvreDateModificationAModifier] = useState(0);
    const [oeuvreImageUrlAModifier, setOeuvreImageUrlAModifier] = useState("");
    const [oeuvreTypeAModifier, setOeuvreTypeAModifier] = useState("");
    const [oeuvreDescriptionAModifier, setOeuvreDescriptionAModifier] = useState("");

    

    const [idOeuvre, setIdOeuvre] = useState("");
    const [oeuvre, setOeuvre] = useState({});

    const [messageErreur, setMessageErreur] = useState("");
//   const [email, setEmail] = useState([]);
//   const [password, setPassword] = useState([]);
//   const [role, setRole] = useState([]);

  ///////////

    async function affiche() {
        await fetch("http://10.0.2.2:4004/publications/")
        .then((response) => response.json())
        .then((data) => setOeuvres(data));
    }

    async function supprimerOeuvre(id) {
        console.log("supprimé");

        let response = await fetch("http://10.0.2.2:4004/publications/" + id, {
            method: "DELETE"
        });

        let data = await response.json();

        setOeuvre(data);

        console.log(data, " a été supprimé");
        affiche();
    }

    async function publierOeuvre() {
        
        let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
        }
        let lesChamps = JSON.stringify({
          "titre" : oeuvreTitreAModifier,
          "auteur" : oeuvreAuteurAModifier,
          "type" : oeuvreTypeAModifier,
          "imageUrl" : oeuvreImageUrlAModifier,
          "description" : oeuvreDescriptionAModifier,
          "date_oeuvre" : oeuvreDateCreationAModifier,
          "date_publication" : new Date(),
          "idRedacteur": "644c43816e9df392ca3ede3d"
        });

        console.log("lesChamps: ", lesChamps);

        let response = await fetch("http://10.0.2.2:4004/publications/", { 
        method: "POST",
        body: lesChamps,
        headers : lesHeaders
        });

        console.log("RESPONSE: ", response);

        let data = await response.json();

        
        if (data.body !== "undefined") { 
            setOeuvre(data);
            setMessageErreur("");
            navigation.navigate("Publication");
        }  else {
            setMessageErreur(data.message);
        }

    }

    async function modifierOeuvre(id) {
        console.log("modification de: " + id);
        
        let lesHeaders = {
        "Accept": "*/*",
        "Content-Type": "application/json"
        }
        if (oeuvreDateCreationAModifier == 0) {
          oeuvreDateCreationAModifier = new Date();
        }
        let lesChamps = JSON.stringify({
          "titre" : oeuvreTitreAModifier,
          "auteur" : oeuvreAuteurAModifier,
          "type" : oeuvreTypeAModifier,
          "imageUrl" : oeuvreImageUrlAModifier,
          "date_oeuvre" : oeuvreDateCreationAModifier,
          "date_modification" : oeuvreDateCreationAModifier
        });

        console.log(lesChamps);

        let response = await fetch("http://10.0.2.2:4004/publications/" + id, { 
        method: "PUT",
        body: lesChamps,
        headers : lesHeaders
        });

        console.log("RESPONSE: ", response);

        let data = await response.json();

        console.log(data, " a été modifié");

        
        if (data.body !== "undefined") { 
          setOeuvre(data);
          setOeuvreModifiee(true);
          setMessageErreur("");
          navigation.navigate("Publication");
        }  else {
          setMessageErreur(data.message);
        }

    }

    async function oeuvreAModifier(id, titre, auteur, type, imageUrl, description, dateOeuvre, datePublication, dateModification) {
        console.log("modification");
        setModifOeuvre(true);
        setShow(false);
        setOeuvreModifiee(false);
        setIdOeuvre(id);
        setOeuvreTitreAModifier(titre);
        setOeuvreAuteurAModifier(auteur); 
        setOeuvreTypeAModifier(type); 
        setOeuvreImageUrlAModifier(imageUrl); 
        setOeuvreDescriptionAModifier(description); 
        setOeuvreDateCreationAModifier(dateOeuvre); 
        setOeuvreDatePublicationAModifier(datePublication); 
        if (dateModification !== null) setOeuvreDateModificationAModifier(dateModification); 
    }

    // function clear() {
        
    //     setIdOeuvre("");
    //     setOeuvreTitreAModifier("");
    //     setOeuvreAuteurAModifier(""); 
    //     setOeuvreTypeAModifier(""); 
    //     setOeuvreImageUrlAModifier(""); 
    //     setOeuvreDescriptionAModifier(""); 
    //     setOeuvreDateCreationAModifier(""); 

    // }

    useEffect(function () {
        affiche();
        setMessageErreur("");
    }, []);

    useEffect(function () {
        setIdOeuvre("");
        setOeuvreTitreAModifier("");
        setOeuvreAuteurAModifier(""); 
        setOeuvreTypeAModifier(""); 
        setOeuvreImageUrlAModifier(""); 
        setOeuvreDescriptionAModifier(""); 
        setOeuvreDateCreationAModifier(""); 
        setOeuvreDatePublicationAModifier(0); 
        setOeuvreDateModificationAModifier(0); 
        affiche();
    }, [oeuvre]);

    // function deconnexion(){
    //   setEstLoggue(false);
    //   navigation.navigate("Accueil")
    // }

    const types = ["peinture", "sculpture"];

  return (
    <View style={{ marginTop: 30, paddingBottom: 200 }}>
      <Text style={styles.titre}>Publication d'articles</Text>
        { show
        ?
        <>
        <TouchableHighlight style={styles.newArticle}>
          <Button title="Publier un article" onPress={()=>{ setShow(false); setModifOeuvre(false); setOeuvre(""); }} />
        </TouchableHighlight>
        <FlatList
            data={oeuvres}
            renderItem={({ item }) => (
            <View style={styles.affichageView}>
                <View>
                    <Text style={styles.textCompte1}>Titre : {item.titre}</Text>
                    <Text style={styles.textCompte1}>Auteur : {item.auteur}</Text>
                    <Text style={styles.textCompte1}>Date de publication : {item.date_publication}</Text>
                </View>
                <View style={styles.buttonsModifDelete}>
                    <TouchableHighlight style={styles.touchable1}>
                      <Text style={styles.textTouchable2} onPress={()=>{supprimerOeuvre(item._id)}}>Supprimer</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touchable2}>
                      <Text style={styles.textTouchable} onPress={()=>{oeuvreAModifier(item._id, item.titre, item.auteur, item.type, item.imageUrl, item.description, item.date_oeuvre, item.date_publication, item.date_modification, item.date_publication)}}>Modifier</Text>
                    </TouchableHighlight>
                </View>
            </View>
            )}
            keyExtractor={(item, index) => item._id}
        />        
        </>
        :
        <ScrollView>
            { modifOeuvre ? <Text style={styles.titre2}>Modification</Text> : <Text style={styles.titre2}>Nouvel article</Text> }
            { oeuvreDatePublicationAModifier !== 0 && <>
            <Text style={styles.titre3}>Date de publication: { oeuvreDatePublicationAModifier }</Text>
            </>
            }
            { oeuvreDateModificationAModifier !== 0 && <>
            <Text style={styles.titre3}>Date de modification: { oeuvreDateModificationAModifier }</Text>
            </>
            }
            <TextInput placeholder="Titre de l'oeuvre" onChangeText={(texte) => setOeuvreTitreAModifier(texte)}  style={styles.input} value={oeuvreTitreAModifier} />
            <TextInput placeholder="Artiste" onChangeText={(texte) => setOeuvreAuteurAModifier(texte)}  style={styles.input} value={oeuvreAuteurAModifier} /> 
            <TextInput placeholder="Date de création de l'oeuvre" onChangeText={(texte) => setOeuvreDateCreationAModifier(texte)}  style={styles.input} value={oeuvreDateCreationAModifier} /> 
            <TextInput placeholder="URL de l'image" onChangeText={(texte) => setOeuvreImageUrlAModifier(texte)}  style={styles.input} value={oeuvreImageUrlAModifier} /> 
            <SelectDropdown
                data={types}
                // defaultValue={types[0]}
                onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setOeuvreTypeAModifier(selectedItem);
                console.log(oeuvreTypeAModifier);
                }}
                defaultButtonText={'Choisir le type'}
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
            <TextInput placeholder="Description (maximum: 1000 caractères)" onChangeText={(texte) => setOeuvreDescriptionAModifier(texte)} style={styles.input} value={oeuvreDescriptionAModifier} multiline={true} numberOfLines={ 10 } /> 

            { messageErreur !== "" &&
            <Text style={styles.alertMessage}>{ messageErreur }</Text>
            }
            { modifOeuvre ?
            <TouchableHighlight style={ styles.touchable }>
                <Text style={styles.btnCourt} onPress={() => { modifierOeuvre(idOeuvre); }}>Valider la modification</Text>
            </TouchableHighlight>
            :
            <TouchableHighlight style={ styles.touchable }>
                <Text style={styles.btnCourt} onPress={() => { publierOeuvre(); }}>Publier l'article</Text>
            </TouchableHighlight>
            }
            {
                oeuvreModifie && modifOeuvre !== true &&
                <Text style={{ marginTop: 20, paddingHorizontal: 20 }}>L'article a bien été publié</Text>
            }
            {
                oeuvreModifie && modifOeuvre &&
                <Text style={{ marginTop: 20, paddingHorizontal: 20 }}>{ JSON.stringify(oeuvre.message)}</Text>
            }
            <TouchableHighlight style={ styles.retourPublication }>
                <Button title="Retour" onPress={() => { setModifOeuvre(false); setShow(true); setOeuvreModifiee(false); }} />
            </TouchableHighlight>
        </ScrollView>
        }
    </View>
  );
};
export default Publication;

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
  newArticle: {
    width: "40%",
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto"
  },
  refresh: {
    marginTop: 30,
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center"
  },
  titre: {
    fontSize: 22,
    textAlign: "center",
    padding: 20,
    borderWidth: 2,
    marginTop: "7%",
    marginHorizontal: 10
  },
  titre2: {
    fontSize: 18,
    textAlign: "center",
    margin: 20
  },
  titre3: {
    fontSize: 16,
    marginTop: 20,
    marginHorizontal: 20
  },
  touchable : {
    backgroundColor: "lightblue",
    width : 200,
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
    fontSize: 16, textAlign: "left" 
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
  retourPublication: {
    marginTop: 30,
    marginBottom: 100,
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