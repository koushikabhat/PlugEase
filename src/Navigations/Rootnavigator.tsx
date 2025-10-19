
import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import OnBoard from "../Screens/OnBoard";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import Splash from "../Screens/Splash";
import { AuthContext } from "../Context/AuthContext";

export default function RootNavigator() {
  const Stack = createNativeStackNavigator();
  const { isLoading, isLoggedIn, hasOnboarded } = useContext(AuthContext);

  const [showSplash, setShowSplash] = useState(true);

  // Splash timer: always show splash on app start
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); // 2 seconds splash
    return () => clearTimeout(timer);
  }, []);

  // If AuthContext is still loading OR splash timer is active, render Splash
  if (isLoading || showSplash) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasOnboarded ? (
          <Stack.Screen name="OnBoard" component={OnBoard} />
        ) : !isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="App" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



  
