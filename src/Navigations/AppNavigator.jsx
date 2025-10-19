import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import TabScreen from "./TabScreen";
import SearchStations from "../Screens/SearchStations";
import MapScreen from "../Screens/MapScreen";
import NearbyStation from "../Screens/NearbyStation";


export default function AppNavigator(){

    const Stack = createNativeStackNavigator();
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainApp" component={TabScreen} />
            <Stack.Screen name="SearchStations" component={SearchStations} />
            <Stack.Screen name="MapScreen"  component={MapScreen}/>
            <Stack.Screen name="NearbyStation" component={NearbyStation} />
            
        </Stack.Navigator>
    )
};