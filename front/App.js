import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { store } from "./contexts/status";

import Menu from "./componants/Menu";
//import Admin from "./componants/Admin";




export default function App() {

  return (
    <Provider store={store}>
      <View style={styles.container}>
          <Menu />
          {/* <Admin /> */}
          <StatusBar style="auto" />
      </View>
    </Provider>
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
