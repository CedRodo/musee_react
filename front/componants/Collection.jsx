import { StyleSheet, Text, View, TextInput,ImageBackground, TouchableWithoutFeedback, Image, Button, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'

// import { dataContext } from "../contexts/dataContext"

const Collection = () => {
  
  const [oeuvres, setOeuvres] = useState([]);
  const [oeuvreUnique, setOeuvreUnique] = useState([]);
  const [oeuvreRecherche, setOeuvreRecherche] = useState("");
  const [artisteRecherche, setArtisteRecherche] = useState("");
  const [show, setShow] = useState(true);
  const [zoomToggle, setZoomToggle] = useState(false);

  const [showList, setShowList] = useState(false)

  const [imageWidth, setImageWidth] = useState(150);
  const [imageHeight, setImageHeight] = useState(200);


  async function affiche() {

    let response = await fetch("http://10.0.2.2:4004/collections", { 
      method: "GET"
    });

    let data = await response.json();
    // console.log("DATA: ", data);

    setOeuvres(data);
  }

  useEffect(function() {
    affiche();                
  }, [])

  async function pageOeuvre(id) {
    // console.log("ID: ", id);

    let response = await fetch("http://10.0.2.2:4004/collections/" + id, { 
      method: "GET"
    });

    let data = await response.json();
    // console.log("DATA: ", data);

    setOeuvreUnique(data);
    
    setShow(!show);
  }

  async function rechercheOeuvres(){  
    if (oeuvreRecherche !== "") {  
      let response = await fetch("http://10.0.2.2:4004/collections/oeuvres/" + oeuvreRecherche, { 
        method: "GET"
      });
      let data = await response.json();
      
      setOeuvres(data);
    }
    setShowList(true);
  }

  async function rechercheArtisteOeuvres(){  
    if (artisteRecherche !== "") {  
      let response = await fetch("http://10.0.2.2:4004/collections/artistes/" + artisteRecherche, { 
        method: "GET"
      });
      let data = await response.json();
      
      setOeuvres(data);
    }
    setShowList(true);
  }

  function zoom(toggle) {
    if (toggle == false) {      
      setImageWidth(300);
      setImageHeight(400);
      return setZoomToggle(true);
    } else {
      setImageWidth(150);
      setImageHeight(200);
      return setZoomToggle(false);
    }
  }



  return (
    <View style={{ marginTop: "8%"}}>
    { show ? 
      <ImageBackground source={{uri : "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/21-the-scream-edvard-munch.jpg"}} style={{width: '100%', height: '100%'}}>
        <ScrollView style={styles.nav}>  
          {/* <TextInput style={styles.input} placeholder="Œuvre" onChangeText={(texte) => {setOeuvreRecherche(texte)}} value={entree}/>    */}
          <TextInput style={styles.input} placeholder="Œuvre (Ex : Joconde)" onChangeText={(texte) => {setOeuvreRecherche(texte)}} value={oeuvreRecherche} />   
          <Button title="Rechercher" onPress={rechercheOeuvres} style={styles.button}/>
          <TextInput style={{backgroundColor : "white", fontSize : 18, padding : 7 , marginBottom : 10,
   borderWidth : 1 , borderColor : "black", marginTop: 20}} placeholder="Artiste" onChangeText={(texte) => {setArtisteRecherche(texte)}}/>
          <Button title="Rechercher" onPress={rechercheArtisteOeuvres} style={styles.button} value={artisteRecherche}/>
          {showList
          ?
          oeuvres.body.map((item, index) => {
            return (
              <View style={styles.espace} key={index}> 
                  <Text style={styles.titre}>{item.titre}</Text>
                  <Text style={{fontSize : 16, textAlign : "center"}}>{item.auteur}</Text>
                  <TouchableWithoutFeedback onPress={()=>{pageOeuvre(item._id)}}>
                    <Image source={{uri : item.imageUrl, width: 350, height : 315} } resizeMode="contain" style={styles.image} />
                  </TouchableWithoutFeedback>
              </View>
            )
          })
            :
            <Text></Text>
          }
        </ScrollView>
             </ImageBackground>
    
      :
      <ScrollView>
        <View style={styles.overlay}>
          
          {/* <ImageBackground source={ { uri: oeuvreUnique.imageUrl, width: "100%", height: "100%" } } style={{opacity: 0.5}}>
            </ImageBackground> */}
          <TouchableWithoutFeedback onPress={
                  () => {setShow(!show);
                }}>
                <Text style={{fontSize: 24, textAlign: "left", marginTop: 20}}>↶ RETOUR</Text>
            </TouchableWithoutFeedback>
            <Text style={styles.titre2}>{oeuvreUnique.titre}</Text>
              <TouchableWithoutFeedback onPress={()=>zoom(zoomToggle)} style={{ width: 150,height: 200 }}>
                <Image source={{ uri: oeuvreUnique.imageUrl, width: imageWidth, height: imageHeight }} resizeMode="contain"/>
                
              </TouchableWithoutFeedback>
            <Text style={styles.auteur}>{oeuvreUnique.auteur}</Text>
            <Text>{oeuvreUnique.date_oeuvre}</Text>
            <Text style={styles.description}>{oeuvreUnique.description}</Text>
        </View>
      </ScrollView>
    }
    </View>
 
    )
}

export default Collection

const styles = StyleSheet.create({
   nav : {margin: 20},
   input : { backgroundColor : "white", fontSize : 18, padding : 7 , marginBottom : 10,
   borderWidth : 1 , borderColor : "black"},
   titre : {fontSize : 24, textAlign: "center"},
   espace : {backgroundColor : "lightblue", opacity: 0.8, paddingBottom: 50, marginTop: 10},
   button : {marginBottom : 20},
   instructions : {width: 350, },
  //  sc : {marginTop: 20},
  image : {
    marginLeft: "auto",
    marginRight: "auto"
  },
  overlay : {alignItems: "center",  backgroundColor:"lightgrey", height: 1000}, //, backgroundColor: "#8f4902"
  description : {paddingHorizontal: 10, marginTop: 20, borderWidth: 2, fontSize: 16, marginHorizontal: 10},
  auteur : {fontStyle: "italic", fontSize: 18, },
  titre2 : {fontSize: 24, marginBottom: 12, marginTop: 10, borderWidth: 2, padding: 7}
})
