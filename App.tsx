import React from "react";
import Rootnavigator from "./src/Navigations/Rootnavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/Context/AuthContext";
import Splash from "./src/Screens/Splash";


function App() {
  return (
    <AuthProvider>
          <Rootnavigator/>
    </AuthProvider>
  )
 
}

export default App;
