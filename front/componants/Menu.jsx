import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';

import Accueil from './Accueil';
import Login from './Login';
import Collection from './Collection';
import Admin from './Admin';
import Publication from './Publication';


// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// const Onglet = createBottomTabNavigator();

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Onglet = createMaterialBottomTabNavigator();

// import { createDrawerNavigator } from '@react-navigation/drawer';
// const Onglet = createDrawerNavigator();

const Menu = () => {
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
                               <Onglet.Screen name='Collection' component={ Collection } options={{
                    tabBarIcon : () => {
                        return <MaterialCommunityIcons name="brush" size={24} color="darkgreen" />
                    }
                }} /> 
                <Onglet.Screen name="Mon compte" component={ Login } options={{
                    tabBarIcon : () => {
                            return <MaterialCommunityIcons name="head" size={24} color="red" />
                        }
                    }}/>
                <Onglet.Screen name="Admin" component={ Admin }  options={{
                    tabBarIcon : () => {
                            return <MaterialCommunityIcons name="key" size={24} color="brown"/>
                        },
                     headerShown: false
                    }}/>
                <Onglet.Screen name="Publication" component={ Publication }  options={{
                    tabBarIcon : () => {
                            return <MaterialCommunityIcons name="book" size={24} color="orange"/>
                        },
                     headerShown: false
                    }}/>
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