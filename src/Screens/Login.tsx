
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKEND_URI } from '@env';

import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

function Login() {
  const navigation = useNavigation();
  const lockImage = require("../Assets/login/lock.png");
  const Logintext = require("../Assets/login/text.png");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    console.log("Inside handleLogin:", phoneNumber);

    // Regex to match exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true); // show loading indicator

    axios
      .post(`http://${BACKEND_URI}/api/auth/send-otp`, { phone: phoneNumber })
      .then((res) => {
        console.log("Login successful", res);
        setLoading(false); // hide loading

        if (res.data.success) {
          navigation.navigate("Otp", { phoneNumber: phoneNumber });
        } else {
          Alert.alert("Error", "Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.log("Login failed at handleLogin fetch", err);
        setLoading(false); // hide loading on error
        Alert.alert("Error", "Something went wrong. Please try again.");
      });
  };

  return (
    <SafeAreaView style={styles.bgwhite}>
      <View style={styles.container}>
        <Image
          style={styles.lockimage}
          source={lockImage}
          resizeMode="contain"
        />
        <Image
          source={Logintext}
          style={styles.textLockImage}
          resizeMode="contain"
        />
        <Text style={styles.textBelowLock}>Login With Your Phone Number</Text>

        <Text style={styles.text2}>
          This number will be used for business communication and providing Support.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Mobile number"
          placeholderTextColor="#999"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {/* Login Button or Loading */}
        {loading ? (
          <View style={[styles.loginButton, { flexDirection: "row", justifyContent: "center" }]}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.loginText}>Sending OTP...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  bgwhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  lockimage: {
    height: 100,
    width: 120,
  },
  textLockImage: {
    height: 70,
    width: 120,
  },
  textBelowLock: {
    fontSize: 28,
    fontWeight: "900",
    fontFamily: "Poppins",
    color: "#0C2964",
    textAlign: "center",
    marginBottom: 15,
  },
  text2: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    color: "black",
    letterSpacing: 6,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    width: "90%",
    marginBottom: 30,
  },
  loginButton: {
    width: 271,
    height: 60,
    backgroundColor: "#0C2964",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loginText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 2.5,
  },
});
