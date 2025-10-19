
// import React, { useContext, useState } from "react";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import {BACKEND_URI} from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator
// } from "react-native";
// import { AuthContext } from "../Context/AuthContext";

// function Otp({ route }) {

//   const { phoneNumber } = route.params; // Get phone number from route params


//   const navigation  = useNavigation();
//   const otpImage = require("../Assets/otp.png");
//   const verifyOtpText = require("../Assets/text.png");
 

//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);

//   //for chnage mobile number 
//   const handleChangeMobileNumber = ()=>{
//     navigation.navigate("Login"); //navigate to login page again
//   }

//   //handle the resending of otp 
//   const handleResendOtp = ()=>{
//     axios.post(`http://${BACKEND_URI}/api/auth/send-otp`, {phone: phoneNumber})
//     .then((res)=>{
//       if(res.data.success){
//         Alert.alert("OTP resent successfully ✅"); 
//         setOtp(''); // Clear the OTP input field
//       }
//       else{
//         Alert.alert(res.data.message);
//       }
//     })
//     .catch((err)=>{
//       console.log("error at resend otp:", err);
//     })
//   }

//   const {setIsLoggedIn} = useContext(AuthContext);


//   const handleVarifyOtp = async() => {
//     console.log("inside verify otp function");
//     if (otp.length === 4) {
//       setLoading(true);
//       axios.post(`http://${BACKEND_URI}/api/auth/verify-otp`, { phone: phoneNumber, otp: otp , role : "user"})
//         .then(async (res) => {
//           setLoading(false);
//           if(res.data.success) 
//           {

//             const token = res.data.token; 
//             await AsyncStorage.setItem("userToken", token);
//             await AsyncStorage.setItem("hasOnboarded", "true"); 
//             setIsLoggedIn(true); // Update context state
//             Alert.alert(res.data.message);
//           } 
//           else 
//           {
//             Alert.alert(res.data.message);
//           }
//         })
//         .catch((err) => {
//           setLoading(false);
//           if(err.response && err.response.data && err.response.data.message)
//           {
//             Alert.alert(err.response.data.message);
//           }
//           else
//           {
//             Alert.alert("Error", "Something went wrong. Please try again.");
//           }
//         });
//     } 
//     else
//     {
//       Alert.alert("Error", "Please enter a valid 4-digit OTP");
//     }
//   };
  




//   return (
//     <SafeAreaView style={styles.bgwhite}>
//       <View style={styles.container}>
//         <Image source={otpImage} style={styles.otpImage} resizeMode="contain" />
//         <Image
//           source={verifyOtpText}
//           style={styles.textImage}
//           resizeMode="contain"
//         />

//         <Text style={styles.infoText}>
//           Enter the OTP sent to your Mobile Number
//         </Text>

//         {/* OTP Input */}
//         <TextInput
//           style={styles.input}
//           keyboardType="numeric"
//           maxLength={6} // usually 6-digit OTP
//           placeholder="Enter OTP"
//           placeholderTextColor="#999"
//           value={otp}
//           onChangeText={setOtp}
//         />

//         {/* Verify Button */}
//         {
//           loading ? (
//             <ActivityIndicator size={"large"} color="#0C2964" style={{marginBottom: 20}} />
//           )
//           :
//           (
//             <TouchableOpacity style={styles.verifyButton} onPress={handleVarifyOtp}>
//               <Text style={styles.verifyText} >Verify</Text>
//             </TouchableOpacity>
//           )
//         }

        
//         <TouchableOpacity onPress={handleResendOtp}>
//             <Text style={styles.linkText}>Resend OTP</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleChangeMobileNumber}>
//             <Text style={styles.linkText}>Change Mobile Number</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// export default Otp;

// const styles = StyleSheet.create({
//   bgwhite: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   container: {
//     flex: 1,
//     alignItems: "center", // center horizontally
//     justifyContent: "center", // center vertically
//     margin: 10,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   otpImage: {
//     height: 100,
//     width: 120,
//   },
//   textImage: {
//     height: 60,
//     width: 140,
//     marginVertical: 10,
//   },
//   infoText: {
//     fontSize: 18,
//     color: "#0C2964",
//     textAlign: "center",
//     marginVertical: 15,
//     fontWeight: "600",
//     marginBottom:20
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#999",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     fontSize: 20,
//     color: "black",
//     letterSpacing: 8,
//     backgroundColor: "#f9f9f9",
//     textAlign: "center",
//     width: "90%",
//     marginBottom: 30,
//   },
//   verifyButton: {
//     width: 271,
//     height: 60,
//     backgroundColor: "#0C2964",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//     marginBottom: 20,
    
//   },
//   verifyText: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//     letterSpacing: 2,
//   },
//   resendText: {
//     fontSize: 16,
//     color: "#0C2964",
//     marginTop: 18,
//     textAlign:"center",
//     marginBottom:20
//   },
//   changeText: {
//     fontSize: 16,
//     color: "#0C2964",
//     marginTop: 5,
//     textAlign : "center"
//   },
//   linkText: {
//     color: "#0C2964",   // blue like a hyperlink
//     fontSize: 16,
//     textDecorationLine: "none", // underline like a link
//     marginVertical: 5,
//     textAlign:"center"
//   }
  
// });


import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKEND_URI } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { AuthContext } from "../Context/AuthContext";

function Otp({ route }) {
  const { phoneNumber } = route.params; // Get phone number from route params
  const navigation = useNavigation();
  const otpImage = require("../Assets/otp.png");
  const verifyOtpText = require("../Assets/text.png");

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn } = useContext(AuthContext);

  // Navigate back to Login
  const handleChangeMobileNumber = () => {
    navigation.navigate("Login");
  };

  // Resend OTP
  const handleResendOtp = () => {
    axios.post(`http://${BACKEND_URI}/api/auth/send-otp`, { phone: phoneNumber })
      .then((res) => {
        if (res.data.success) {
          Alert.alert("OTP resent successfully ✅");
          setOtp('');
        } else {
          Alert.alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error resending OTP:", err);
        Alert.alert("Error", "Could not resend OTP. Try again later.");
      });
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    axios.post(`http://${BACKEND_URI}/api/auth/verify-otp`, { phone: phoneNumber, otp: otp, role: "user" })
      .then(async (res) => {
        setLoading(false);
        if (res.data.success) {
          const token = res.data.token;
          await AsyncStorage.setItem("userToken", token);
          await AsyncStorage.setItem("hasOnboarded", "true");
          setIsLoggedIn(true);
          Alert.alert(res.data.message);
        } else {
          Alert.alert(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.message) {
          Alert.alert(err.response.data.message);
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      });
  };

  return (
    <SafeAreaView style={styles.bgWhite}>
      <View style={styles.container}>
        <Image source={otpImage} style={styles.otpImage} resizeMode="contain" />
        <Image source={verifyOtpText} style={styles.textImage} resizeMode="contain" />

        <Text style={styles.infoText}>Enter the OTP sent to your Mobile Number</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOtp}
          disabled={loading} // Prevent multiple clicks
        >
          {loading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.verifyText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.verifyText}>Verify</Text>
          )}
        </TouchableOpacity>

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
  bgWhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 20,
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
  linkText: {
    color: "#0C2964",
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
});
