
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Geolocation from "@react-native-community/geolocation";
import { BACKEND_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function Home() {
  const [lat, setLatitude] = useState(null);
  const [long, setLongitude] = useState(null);


  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const halfScreen = screenHeight / 2;
  const collapsedY = screenHeight * 0.8;

  const translateY = useSharedValue(halfScreen);
  const startY = useSharedValue(0);
  const [loading, setLoading] = React.useState(true)


  const [loadingNearby, setloadingNearby] = useState(false);



  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      let newY = startY.value + event.translationY;
      if (newY < halfScreen) newY = halfScreen;
      if (newY > collapsedY) newY = collapsedY;
      translateY.value = newY;
    })
    .onEnd(() => {
      if (translateY.value < (halfScreen + collapsedY) / 2) {
        translateY.value = withSpring(halfScreen);
      } else {
        translateY.value = withSpring(collapsedY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));



  const requestLocationPermission = async () => {
    console.log("Inside reuestLocationpermission");
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');

       
        Geolocation.getCurrentPosition(
          (position) => {
            // success callback
            const { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed } = position.coords;
            const timestamp = position.timestamp;
        
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            // console.log("Altitude:", altitude);
            // console.log("Accuracy:", accuracy);
            // console.log("Altitude Accuracy:", altitudeAccuracy);
            // console.log("Heading:", heading);
            // console.log("Speed:", speed);
            console.log("Timestamp:", timestamp);
        
            setLatitude(latitude);
            setLongitude(longitude);
            // console.log(lat);
            // console.log(long)

            fetchStationsForNearby(latitude, longitude); 
          },
          (error) => {
            // error callback
            const { code, message } = error;
            console.log("Location error code:", code);
            console.log("Location error message:", message);
        
            Alert.alert("Enable the Location for nearby");
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 20000,
          }
        );
        
        
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };



  const getNearbyStations = async () => {
    try
    {
      setloadingNearby(true);
      await requestLocationPermission(); 
    }
    catch (err)
    {
      setloadingNearby(false);
      console.error(err);
    }finally
    {
      setloadingNearby(false);
    }
  }

 

  const fetchStationsForNearby = async (latitude : number,longitude:number) => {
    
    const token = await AsyncStorage.getItem("userToken");
    try
    {
      // console.log("fetching nearby stations called.....")
      const res = await fetch(`http://${BACKEND_URI}/api/stations/search-nearby`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}` 
        },
        body : JSON.stringify({latitude,longitude})
      })

      const data = await res.json();
      if(data.success)
      {
        // console.log("Fetch nearby stations response:", data?.data);
        navigation.navigate("NearbyStation", { data: data?.data }); 
      }
      else{
        console.log(data.message);
        Alert.alert(data?.message);
      }
    }
    catch(err)
    {
      console.error("error at fetch station nearby",err);
    }
  }



  const mapref = useRef(null);

  if(mapref.current)
  {
    mapref.current.animateToRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.01,   // smaller delta = more zoomed-in
      longitudeDelta: 0.01,
    },1000)
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapref}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: lat || 12.9716,
            longitude: long||77.5946,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          userInterfaceStyle={"dark"}
          onMapReady={() => setLoading(false)}
        >
          <Marker coordinate={{ latitude:lat || 12.9716, longitude: long||77.5946}} title="You" />
        </MapView>

        {/* Bottom sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>
            <View style={styles.handle} />

            <View style={styles.searchContainer}>
              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => navigation.navigate("SearchStations")}
              >
                <Text style={styles.textforsearch}>🔍  Search station, place...</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.vehicleContainer}>
              <View style={styles.vehicleBox}>
                <TouchableOpacity style={styles.vehicleButton}
                onPress={() => navigation.navigate("SearchStations",{vehicleType: "car"})}
                >
                  <Image
                    source={require("../Assets/CarAndScooty/car.png")}
                    style={styles.vehicleImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.vehicleBox}>
                <TouchableOpacity style={styles.vehicleButton}
                  onPress={() => navigation.navigate("SearchStations",{vehicleType: "scooty"})}
                >
                  <Image
                    source={require("../Assets/CarAndScooty/scooty.png")}
                    style={styles.vehicleImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>



            {/* Nearby station  */}
            <View style={styles.vehicleContainer}>
              <View style={styles.vehicleBox}>
                
                <TouchableOpacity
                  style={styles.vehicleButton}
                  onPress={getNearbyStations}
                  // disabled={loadingNearby}
                >
                  {loadingNearby ? 
                  ( <ActivityIndicator size="small" color="green" /> )
                   :
                    (
                      <>
                        <Text>Search nearby</Text>
                        <Image
                          source={require("../Assets/CarAndScooty/near.png")}
                          style={styles.vehicleImage}
                          resizeMode="contain"
                        />
                      </> 
                      )}
                </TouchableOpacity>
              </View>

              {/* <View style={styles.vehicleBox}>
                <TouchableOpacity style={styles.vehicleButton}>
                  <Image
                    source={require("../Assets/CarAndScooty/car.png")}
                    style={styles.vehicleImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View> */}
            </View>


          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
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
  textforsearch: {
    color: "black",
    padding: 15,
    fontSize: 18,
  },
  vehicleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  vehicleBox: {
    borderColor: "darkgreen",
    borderWidth: 2,
    borderRadius: 15,
    width: 130,
  },
  vehicleButton: {
    alignItems: "center",
  },
  vehicleImage: {
    width: 100,
    height: 80,
    marginBottom: 0,
  },
});

