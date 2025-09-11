import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "../Screens/Splash";
import OnBoard from "../Screens/OnBoard";
import Login from "../Screens/Login";

function Rootnavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown : false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="OnBoard" component={OnBoard} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Rootnavigator;
