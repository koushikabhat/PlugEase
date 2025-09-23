import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import TabScreen from "./TabScreen";
import SearchScreen from "../Screens/SearchScreen";


export default function AppNavigator(){

    const Stack = createNativeStackNavigator();
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainApp" component={TabScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />  
        </Stack.Navigator>
    )
};