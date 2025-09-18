import React, { Profiler } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";           
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import BookingHistory from "../Screens/BookingHistory";

const Tab = createBottomTabNavigator(); 


function BottomTabs(){
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Bookings" component={BookingHistory} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

export default BottomTabs;