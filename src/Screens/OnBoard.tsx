
import React, { useContext } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context/AuthContext";


function OnBoard() {

  const {setHasOnboarded} = useContext(AuthContext);
  const {completeOnboarding } = useContext(AuthContext);
  const { height, width } = Dimensions.get("window"); // get device size

  const slides = [
    {
      key: "one",
      title: "first",
      text: "Select Station Based on your Location",
      image: require("../Assets/onboard2.png"),
    },
    {
      key: "two",
      title: "second",
      text: "Select Stations",
      image: require("../Assets/onboard1.png"),
    },
    {
      key: "three",
      title: "third",
      text: "Get Charged",
      image: require("../Assets/Onboard3.png"),
      isLast: true,
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={item.image} style={[styles.image,{ height: height * 0.75, width: width * 0.9 }]} resizeMode="contain" />
        <View>
          {item.isLast && (
            <TouchableOpacity style={styles.button} onPress={ async() => {
              completeOnboarding();
              setHasOnboarded(true)}}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };

  const onDone = async() => {
    completeOnboarding();
    // navigation.replace("Login");
  };

  const renderNextButton = () => (
    <View style={styles.nextButton}>
      <Text style={styles.nextText}>--›</Text> 
    </View>
  );

  return <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} showDoneButton={false}  renderNextButton={renderNextButton}/>;
}

export default OnBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // center everything horizontally
    justifyContent: "center",
  },
  image: {
    marginBottom:0,
    height: 900,
    width: 330
  },
  nextButton: {
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: "#00AB82",
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  button: {
    height:55,
    width:250,
    borderRadius: 15,
    backgroundColor: "#00AB82",
    paddingVertical: 10,
    paddingHorizontal: 60,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
  },
});
