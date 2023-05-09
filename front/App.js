import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { ProfilContextProvider } from "./contexts/profilContext"
import { store } from "./contexts/status";

import Menu from "./componants/Menu";




export default function App() {

  return (
    <Provider store={store}>
      <View style={styles.container}>      
          <ProfilContextProvider>
              <Menu />
          </ProfilContextProvider>
          <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
