import React, { Profiler } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";           
import { Animated, StyleSheet,  Text, View, TouchableOpacity } from 'react-native';



import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import BookingHistory from "../Screens/BookingHistory";

import HomeIcon from "../Assets/svgIcons/home.svg"
import ProfileIcon from "../Assets/svgIcons/profile.svg";
import ThunderIcon from "../Assets/svgIcons/thunder.svg";


const Tab = createBottomTabNavigator(); 

//icons



const AnimatedTabIcon = ({ focused, IconComponent }) => {
    const size = focused ? 35 : 23;
    const color = focused ? "#FFFFFF" : "#FFFFFF";
  
    return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
        <IconComponent width={size} height={size} color={color} />
    </View>
    );
  };


function TabScreen(){
    return(
        <Tab.Navigator screenOptions={{ headerShown: false , tabBarStyle :{backgroundColor : "#1E1E1E", height : 50},
        tabBarLabelStyle: {
            fontSize: 12,   // 👈 change this
            fontWeight: "900", 
            marginBottom: 5, // move label up/down
        },
        tabBarActiveTintColor: "#FFFFFF",}}  initialRouteName="Home">


            <Tab.Screen name="Home" component={Home} options={{tabBarIcon : ({focused}) => (
                <AnimatedTabIcon focused={focused} IconComponent={HomeIcon}/>
            )}}/>


            <Tab.Screen name="Bookings" component={BookingHistory} options={{tabBarIcon : ({focused}) => (
                <AnimatedTabIcon focused={focused} IconComponent={ThunderIcon}/>
            )}}/>

            {/* <Tab.Screen name="SearchStations" component={SearchStations} options={{ tabBarStyle: { display: "none" } }}/> */}

            <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon : ({focused}) => (
                <AnimatedTabIcon focused={focused} IconComponent={ProfileIcon}/>
            )}}/>


        </Tab.Navigator>
    );
}

export default TabScreen;