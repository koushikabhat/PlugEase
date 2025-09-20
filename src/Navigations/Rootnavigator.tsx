import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "../Screens/Splash";
import OnBoard from "../Screens/OnBoard";
import Login from "../Screens/Login";
import Otp from "../Screens/Otp";

import TabScreen from "./TabScreen";
import SearchScreen from "../Screens/SearchScreen";
// import { BottomTabs } from "react-native-screens";

function Rootnavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown : false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="OnBoard" component={OnBoard} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Otp" component={Otp} />
        
        <Stack.Screen name="MainApp" component={TabScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Rootnavigator;
