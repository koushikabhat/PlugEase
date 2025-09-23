
import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";

function Splash() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Image source={require("../Assets/splash_logo.png")} style={styles.logo} /> */}
      <Text style={styles.text}>Welcome to PlugEase</Text>
    </SafeAreaView>
  );
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C2964",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 150, height: 150, marginBottom: 20 },
  text: { color: "white", fontSize: 22, fontWeight: "bold" },
});
