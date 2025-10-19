// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   Animated,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";

// export default function Splash() {
//   const logoOpacity = useRef(new Animated.Value(0)).current;
//   const logoScale = useRef(new Animated.Value(0.8)).current; // optional scale animation

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(logoOpacity, {
//         toValue: 1,
//         duration: 2000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(logoScale, {
//         toValue: 1,
//         friction: 10,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
//       <View style={styles.container}>
//         <Animated.Image
//           source={require("../Assets/logo/splash_logo.png")}
//           style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
//           resizeMode="contain"
//         />

//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#ffffff" />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 160,
//     height: 160,
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     position: "absolute",
//     bottom: 60,
//     alignItems: "center",
//   },
// });


import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
  Text,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Splash() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  // Animated value for loading line
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading line animation (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: width - 60, // full width minus some padding
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.container}>
        <Animated.Image
          source={require("../Assets/logo/splash_logo.png")}
          style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
          resizeMode="contain"
        />

        {/* Loading line */}
        <View style={styles.loadingContainer}>
          <View style={styles.lineBackground}>
            <Animated.View
              style={[
                styles.lineForeground,
                { transform: [{ translateX: lineAnim }] },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Powering up...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 50,
  },
  loadingContainer: {
    marginTop:70,
    width: "80%",
    alignItems: "center",
  },
  lineBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#545454", // dark background for line
    borderRadius: 2,
    overflow: "hidden",
  },
  lineForeground: {
    width: 70, // length of moving bar
    height:20,
    backgroundColor: "#0000FF", // navy blue
    borderRadius: 10,
    position: "absolute",
    left: 0,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
  },
});

