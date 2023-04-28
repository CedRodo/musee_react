import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import "react-native-gesture-handler";


import Menu from "./componants/Menu";
import Admin from "./componants/Admin";




export default function App() {

  return (
    <View style={styles.container}>

      

        <Menu />
        {/* <Admin /> */}
        
        

        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
   // justifyContent: "center",
  },
});
