
import React from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {BACKEND_URI} from '@env';

import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

function Login() {
  const navigation  = useNavigation();
  const lockImage = require("../Assets/login/lock.png");
  const Logintext = require("../Assets/login/text.png");

  const [phoneNumber, setPhoneNumber] = React.useState("");



  const handleLogin = ()=>{

    // console.log("Login button pressed with phone number:", phoneNumber);
    // // Validate phone number (basic validation for 10-digit number) 
    console.log(" inside handlelogin ", phoneNumber);
    if(phoneNumber.length !== 10){
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

      console.log(" above axios ");
      axios.post(`http://${BACKEND_URI}/api/auth/send-otp`, {phone :phoneNumber})
      .then((res) => 
      {
        console.log("login successfull", res);
        if(res.data.success)
        {
          navigation.navigate("Otp", {phoneNumber: phoneNumber});
        }
        else{
          alert("Failed to send OTP. Please try again.");
        }
      })
      .catch((err) =>
      {
        console.log("login failed at the handlelogin fetch", err);
      });
  }


  return (
    <SafeAreaView style={styles.bgwhite}>
      <View style={styles.container}>
        <Image
          style={styles.lockimage}
          source={lockImage}
          resizeMode="contain"
        />
        <Image source={Logintext} style={styles.textLockImage} resizeMode="contain"></Image>
        <Text style={styles.textBelowLock}>Login With Your Phone Number</Text>

        <Text style={styles.text2}>
          This number will be used for business communication and providing
          Support.
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Mobile number"
          placeholderTextColor="#999"
          value={phoneNumber}
          onChangeText={setPhoneNumber} //directly sets the value of phone number
        />
        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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
    // borderColor: "#000",
    // borderWidth: 2,
    margin: 10,
    alignItems: "center", // center horizontally
    justifyContent: "center", // center vertically
    padding: 20,
  },
  lockimage: {
    height: 100,
    width: 120,
    // marginBottom: 0,
  },
  textLockImage:{
    height: 70,
    width: 120,
    // marginBottom: 1,
  },
  textBelowLock: {
    fontSize: 28,
    fontWeight: "900",
    fontFamily: "Poppins", // requires poppins installed
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
    letterSpacing: 2.5
  },
});
