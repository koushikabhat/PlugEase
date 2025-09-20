
import React from "react";
import { View,Text, Dimensions, StyleSheet, TextInput, KeyboardAvoidingView,Platform,TouchableOpacity, Image} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

import { useNavigation } from '@react-navigation/native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function Home() {


  const navigation = useNavigation();

  const screenHeight = Dimensions.get("window").height;
  const halfScreen = screenHeight / 2;

  // shared value for Y position
  const translateY = useSharedValue(halfScreen);

  const startY = useSharedValue(0);


  const collapsedY = screenHeight * 0.8; // bottom limit

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value; // save start position
    })
    .onUpdate((event) => {
      let newY = startY.value + event.translationY;

      // limit movement between halfScreen and collapsedY
      if (newY < halfScreen) newY = halfScreen;
      if (newY > collapsedY) newY = collapsedY;

      translateY.value = newY;
    })
    .onEnd(() => {
      // snap to nearest point (either halfScreen or collapsedY)
      if (translateY.value < (halfScreen + collapsedY) / 2) {
        translateY.value = withSpring(halfScreen); // expand
      } else {
        translateY.value = withSpring(collapsedY); // collapse
      }
    });

  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={
            {
              latitude: 12.9716,
              longitude: 77.5946,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          userInterfaceStyle={'light'}>
          <Marker
            coordinate={{ latitude: 12.9716, longitude: 77.5946 }}
            title="You"
          />
        </MapView>

        {/* Bottom sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>

            <View style={styles.handle} />

            <View style={styles.searchContainer}>
              <TouchableOpacity style={styles.searchInput} onPress={()=> navigation.navigate("SearchScreen")}>
                <Text style={styles.textforsearch}>Search Here...</Text>
              </TouchableOpacity>
            </View>


            <View style={styles.vehicleContainer}>

                <View style={styles.vehicleBox}>
                  <TouchableOpacity style={styles.vehicleButton}>
                    <Image source={require('../Assets/CarAndScooty/car.png')} style={styles.vehicleImage} resizeMode="contain" />
                  </TouchableOpacity>
                </View>


                <View style= {styles.vehicleBox}>
                  <TouchableOpacity  style={styles.vehicleButton}>
                    <Image source={require('../Assets/CarAndScooty/scooty.png')}  style={styles.vehicleImage} resizeMode="contain"/>
                  </TouchableOpacity>
                </View>

            </View>


            <View style={styles.vehicleContainer}>
                  <View style={styles.vehicleBox}>
                    <TouchableOpacity style={styles.vehicleButton}>
                      <Image source={require('../Assets/CarAndScooty/car.png')} style={styles.vehicleImage} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.vehicleBox}>
                    <TouchableOpacity style={styles.vehicleButton}>
                      <Image source={require('../Assets/CarAndScooty/car.png')} style={styles.vehicleImage} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, 
    height: "100%",  
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  
  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#aaa",
    alignSelf: "center",
    marginVertical: 10,
  },
  searchContainer: {
    // borderColor: "black",
    // borderWidth: 1,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 10,
    
  },
  
  searchInput: {
    height: 50,
    width: 300,
    backgroundColor: "#A8DCAB",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  textforsearch:{
    color : "black",
    padding: 15,
    fontSize: 18,
  },

  vehicleContainer: {
    flexDirection: "row",   // arrange horizontally
    justifyContent: "space-around", // even spacing
    marginTop: 15,
  },
  
  vehicleBox :{
    borderColor: "darkgreen",
    borderWidth: 2,
    borderRadius: 15,
    width : 130
  },

  vehicleButton: {
    alignItems: "center",   // center image + text
  },
  
  vehicleImage: {
    width: 100,   // adjust as needed
    height: 80,
    marginBottom: 0,
  },
  
  
});

