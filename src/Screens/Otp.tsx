
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {BACKEND_URI} from '@env';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";

function Otp({ route }) {

  const { phoneNumber } = route.params; // Get phone number from route params


  const navigation  = useNavigation();
  const otpImage = require("../Assets/otp.png");
  const verifyOtpText = require("../Assets/text.png");
 

  const [otp, setOtp] = useState('');

  //for chnage mobile number 
  const handleChangeMobileNumber = ()=>{
    navigation.navigate("Login"); //navigate to login page again
  }

  //handle the resending of otp 
  const handleResendOtp = ()=>{
    axios.post(`http://${BACKEND_URI}/api/auth/send-otp`, {phone: phoneNumber})
    .then((res)=>{
      if(res.data.success){
        Alert.alert("OTP resent successfully ✅"); 
        setOtp(''); // Clear the OTP input field
      }
      else{
        Alert.alert(res.data.message);
      }
    })
    .catch((err)=>{
      console.log("error at resend otp:", err);
    })
  }

  const handleVarifyOtp = () => {
    if (otp.length === 4) {
      axios.post(`http://${BACKEND_URI}/api/auth/verify-otp`, { phone: phoneNumber, otp: otp })
        .then((res) => {

          if(res.data.success) {
            navigation.navigate("Home");
            Alert.alert(res.data.message);
          } else {
            Alert.alert(res.data.message);
          }
        })
        .catch((err) => {
          if(err.response && err.response.data && err.response.data.message)
          {
            Alert.alert(err.response.data.message);
          }
          else
          {
            Alert.alert("Error", "Something went wrong. Please try again.");
          }
        });
    } 
    else
    {
      Alert.alert("Error", "Please enter a valid 4-digit OTP");
    }
  };
  




  return (
    <SafeAreaView style={styles.bgwhite}>
      <View style={styles.container}>
        <Image source={otpImage} style={styles.otpImage} resizeMode="contain" />
        <Image
          source={verifyOtpText}
          style={styles.textImage}
          resizeMode="contain"
        />

        <Text style={styles.infoText}>
          Enter the OTP sent to your Mobile Number
        </Text>

        {/* OTP Input */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={6} // usually 6-digit OTP
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          value={otp}
          onChangeText={setOtp}
        />

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={handleVarifyOtp}>
          <Text style={styles.verifyText} >Verify</Text>
        </TouchableOpacity>

        {/* Footer Options */}
        {/* <Text style={styles.resendText}>Resend OTP</Text>
        <Text style={styles.changeText}>Change Mobile Number</Text> */}
        <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.linkText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChangeMobileNumber}>
            <Text style={styles.linkText}>Change Mobile Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Otp;

const styles = StyleSheet.create({
  bgwhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center", // center horizontally
    justifyContent: "center", // center vertically
    margin: 10,
    padding: 20,
    backgroundColor: "#fff",
  },
  otpImage: {
    height: 100,
    width: 120,
  },
  textImage: {
    height: 60,
    width: 140,
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    color: "#0C2964",
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "600",
    marginBottom:20
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    color: "black",
    letterSpacing: 8,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    width: "90%",
    marginBottom: 30,
  },
  verifyButton: {
    width: 271,
    height: 60,
    backgroundColor: "#0C2964",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
    
  },
  verifyText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  resendText: {
    fontSize: 16,
    color: "#0C2964",
    marginTop: 18,
    textAlign:"center",
    marginBottom:20
  },
  changeText: {
    fontSize: 16,
    color: "#0C2964",
    marginTop: 5,
    textAlign : "center"
  },
  linkText: {
    color: "#0C2964",   // blue like a hyperlink
    fontSize: 16,
    textDecorationLine: "none", // underline like a link
    marginVertical: 5,
    textAlign:"center"
  }
  
});
