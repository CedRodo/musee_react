import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableHighlight } from 'react-native-gesture-handler';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [role, setRole] = useState([]);

    
///////////
    async function affiche() {
        await fetch("http://10.0.2.2:4004/admin/utilisateurs/") 
       .then(response => response.json())
       .then(data => setUsers(data))
      }
    
    useEffect(function () {
        affiche()        
    }, [])

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
            
            <View style={{marginTop : 30}}>
                            
               <Text style={styles.titre}>Gestion des profils</Text>
                <FlatList 
                data={users}
                renderItem={({item}) =>
                            <View style={styles.affichageView}>
                            <Text>ID : {item._id}</Text>
                            <Text>email : {item.email}</Text>
                            <Text>Rôle : {item.role}</Text>
                            </View>
                }
                
                />
            </View>
     
        
        )

}      
export default Admin

const styles = StyleSheet.create({
    affichageView : {marginVertical : 10, alignItems : "center"},
    titre : {fontSize : 22, textAlign : "center", paddingVertical: 20, borderWidth: 2}

})

// voir tous les profils
// modif l'un deux
// suppr l'un deux