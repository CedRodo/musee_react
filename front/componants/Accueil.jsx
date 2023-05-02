import { ScrollView, StyleSheet, Text, View, Image, Button, FlatList, TouchableWithoutFeedback, ImageBackground, ImageBackgroundBase } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import Swiper from 'react-native-swiper';

const Accueil = () => {

  // const [accueilOeuvres , setAccueilOeuvres] = useState([{body:[{imageUrl:"https://cdn.mediatheque.epmoo.fr/link/3c9igq/bik19u984kke0yo.jpg"}]}]);
  const [accueilOeuvres , setAccueilOeuvres] = useState({});
  const [id, setId] = useState("");
  const [oeuvre, setOeuvre] = useState({});
  const [show, setShow] = useState(true);
  const [zoomToggle, setZoomToggle] = useState(false);

  const [oeuvre1Id, setOeuvre1Id] = useState("");
  const [oeuvre2Id, setOeuvre2Id] = useState("");
  const [oeuvre3Id, setOeuvre3Id] = useState("");
  const [oeuvre4Id, setOeuvre4Id] = useState("");
  const [oeuvre5Id, setOeuvre5Id] = useState("");
  const [oeuvre6Id, setOeuvre6Id] = useState("");
  const [oeuvre7Id, setOeuvre7Id] = useState("");
  const [oeuvre8Id, setOeuvre8Id] = useState("");
  const [oeuvre9Id, setOeuvre9Id] = useState("");

  const [imageWidth, setImageWidth] = useState(200);
  const [imageHeight, setImageHeight] = useState(400);

  async function pageAccueil() {

    let response = await fetch("http://10.0.2.2:4004/collections", { 
      method: "GET"
    });

    let data = await response.json();
    
    setAccueilOeuvres(data);
    // console.log("AccueilOeuvres: ", accueilOeuvres);

    // console.log("Message d'accueil ", accueilOeuvres.message);
  }

  useEffect(function() {
    pageAccueil();
  }, []);

  async function pageOeuvre(id) {

    let response = await fetch("http://10.0.2.2:4004/collections/" + id, { 
      method: "GET"
    });

    let data = await response.json();

    setOeuvre(data);
    setShow(!show);
  }

  let images = [];
  useEffect(function() {
    if(Object.keys(accueilOeuvres).length > 0) {
      // console.log("AccueilOeuvres: ", accueilOeuvres);     
      setOeuvre1Id(accueilOeuvres.body[0]._id);
      setOeuvre2Id(accueilOeuvres.body[1]._id);
      setOeuvre3Id(accueilOeuvres.body[2]._id);
      setOeuvre4Id(accueilOeuvres.body[3]._id);
      setOeuvre5Id(accueilOeuvres.body[4]._id);
      setOeuvre6Id(accueilOeuvres.body[5]._id);
      setOeuvre7Id(accueilOeuvres.body[6]._id);
      setOeuvre8Id(accueilOeuvres.body[7]._id);
      setOeuvre9Id(accueilOeuvres.body[8]._id);

    }
    
  }, [accueilOeuvres])
  
  // useEffect(function(){
  //   pageOeuvre(id);
  // }, [id]);

  function zoom(toggle) {
    if (toggle == false) {      
      setImageWidth(400);
      setImageHeight(600);
      return setZoomToggle(true);
    } else {
      setImageWidth(200);
      setImageHeight(400);
      return setZoomToggle(false);
    }
  }
//  const imageJoconde = "../assets/portrait-de-l-artiste-van-gogh.jpg"
//  const imageJoconde = accueilOeuvres.body[0].image
  return (

    <View style={styles.container}>
    { show ?
        ( Object.keys(accueilOeuvres).length > 0 ?
        <View>
          <Swiper style={styles.wrapper} showsButtons loop={true} autoplay={true} autoplayTimeout={3}>
            <View testID="Un" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre1Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[0].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Deux" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre2Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[1].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Trois" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre3Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[2].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Quatre" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre4Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[3].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Cinq" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre5Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[4].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Six" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre6Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[5].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Sept" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre7Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[6].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Huit" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre8Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[7].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
            <View testID="Neuf" style={styles.slide1}>
              <TouchableWithoutFeedback onPress={()=>{pageOeuvre(oeuvre9Id)}}>
                <ImageBackground source={ { uri: accueilOeuvres.body[8].imageUrl }  } style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            </View>
          </Swiper>
        </View>
        :
        <View></View>
        )
      :
      <ScrollView>
        <View style={styles.oeuvreImage}>
          <TouchableWithoutFeedback onPress={
                 () => {setShow(!show);
                }}>
                <Text style={{fontSize: 24, marginTop: 10}}>↶ RETOUR</Text>
          </TouchableWithoutFeedback>
          <Text>{oeuvre.titre}</Text>
            <TouchableWithoutFeedback onPress={()=>zoom(zoomToggle)} style={{ width: 200,height: 400 }}>
              <Image source={ { uri: oeuvre.imageUrl, width: imageWidth, height: imageHeight }  }  resizeMode="contain" />
              {/* style={styles.image} */}
            </TouchableWithoutFeedback>
          <Text>{oeuvre.auteur}</Text>
          <Text>{oeuvre.date}</Text>
          <Text>{oeuvre.description}</Text>
          
        </View>
      </ScrollView>
      }
    </View>  
  )
}
      // <FlatList
      //       data={accueilOeuvres}
      //       renderItem={({item}) => 
      //       <View key={key} style={styles.oeuvres}>    
      //         <TouchableWithoutFeedback onPress={ ()=> { setShow(!show); setId(item._id) } }>
      //           <Image source={ { uri: item.imageUrl, width: 300, height: 200 }  } style={styles.image} resizeMode="contain" />
      //         </TouchableWithoutFeedback>
      //         <Text>{ item.titre }</Text>
      //         <Text>{ item.auteur }</Text>
      //         <Text>{ item.type }</Text>
      //         <Text>{ item.description }</Text>
      //       </View>
      //       }
      //       keyExtractor={item => item._id}
      //     />       

export default Accueil

const styles = StyleSheet.create({
  container: {
    marginTop: "7%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: 'antiquewhite',
    alignItems: 'center',
    justifyContent: "flex-start"
  },
  oeuvreImage: {
    marginBottom: 20,
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  titreAccueil: {
    fontSize: 30,
    fontWeight: 500,
    textAlign: "center"
  },
  image: {
    height: 200
  },
  oeuvres: {
    width: "90%",
    marginTop: 40,
    flexDirection: "column",
    backgroundColor: 'antiquewhite',
    alignItems: 'center'
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
 
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})
