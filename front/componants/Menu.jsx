import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { ProfilContext } from '../contexts/profilContext';
import Accueil from './Accueil';
import Login from './Login';
import Collection from './Collection';
import Admin from './Admin';
import Publication from './Publication';

const Onglet = createMaterialBottomTabNavigator();

const Menu = () => {

  const isRole = useSelector((store) => store.reducerIsRole);
  const monProfil = useContext(ProfilContext);

    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Onglet.Navigator initialRouteName="Login" 
                    activeColor="darkblue"
                    inactiveColor="#3e2465"
                    barStyle={{ backgroundColor: 'white' }}
                >
            
                    <Onglet.Screen name="Accueil" component={ Accueil } options={{
                        tabBarIcon : () => {
                            return <MaterialCommunityIcons name="home" size={24} color="blue" />
                            }
                    }} /> 
                    <Onglet.Screen name='Collections' component={ Collection } options={{
                        tabBarIcon : () => {
                            return <MaterialCommunityIcons name="brush" size={24} color="darkgreen" />
                            }
                    }} /> 
                    <Onglet.Screen name="Mon compte" component={ Login } options={{
                        tabBarIcon : () => {
                                return <MaterialCommunityIcons name="head" size={24} color="red" />
                            }
                    }}/>
                    { isRole.isAdmin &&
                    <Onglet.Screen name="Admin" component={ Admin }  options={{
                        tabBarIcon : () => {
                                return <MaterialCommunityIcons name="key" size={24} color="brown"/>
                            }
                    }}/>
                    }
                    { (isRole.isAdmin || isRole.isRedacteur) &&
                    <Onglet.Screen name="Publication" component={ Publication }  options={{
                        tabBarIcon : () => {
                                return <MaterialCommunityIcons name="book" size={24} color="orange"/>
                            }
                    }}/>
                    }
                </Onglet.Navigator>
    
            </NavigationContainer>
        </View>
  )
}

export default Menu

const styles = StyleSheet.create({
container : { flex: 1},
nav : {marginTop: 20}

})