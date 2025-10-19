

// import React, { useCallback, useRef, useMemo, useState} from "react";
// import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import MapView, { Marker } from "react-native-maps";
// import { useNavigation } from "@react-navigation/native";

// export default function NearbyStation({ route }) {
//     const navigation = useNavigation();
//   const { data: stations } = route.params;
//   const [selectedStationId, setSelectedStationId] = useState(null);
 
//   const sheetRef = useRef<BottomSheet>(null);
//   const mapRef = useRef<MapView>(null);
//   const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
//   const handleSheetChange = useCallback((index) => {
//     console.log("handleSheetChange", index);
//   }, []);

//   // initial region (first station)
//   const initialRegion = stations.length
//     ? {
//         latitude: stations[0].location.coordinates[1],
//         longitude: stations[0].location.coordinates[0],
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       }
//     : {
//         latitude: 20,
//         longitude: 77,
//         latitudeDelta: 10,
//         longitudeDelta: 10,
//       };

//   // focus map on a selected station
//   const focusOnStation = (station) => {
//     setSelectedStationId(station._id);
//     mapRef.current?.animateToRegion(
//       {
//         latitude: station.location.coordinates[1],
//         longitude: station.location.coordinates[0],
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       },
//       1000 // animation duration
//     );
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       {/* Map View */}
//       <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={initialRegion}  userInterfaceStyle={"light"}>
//         {stations.map((station) => (
//           <Marker
//             key={station._id}
//             coordinate={{
//               latitude: station.location.coordinates[1],
//               longitude: station.location.coordinates[0],
//             }}
//             title={station.name}
//             description={station.address}
//             pinColor={selectedStationId === station._id ? "blue" : "red"}
            
//           />
//         ))}
//       </MapView>

//       {/* Bottom sheet */}
//       <BottomSheet
//         ref={sheetRef}
//         index={1}
//         snapPoints={snapPoints}
//         enableDynamicSizing={false}
//         onChange={handleSheetChange}
//       >
//         <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
//           <Text style={styles.header}>Nearby Stations</Text>
//           <TouchableOpacity onPress={()=> navigation.goBack()}>
//             <Text>Go Back to home</Text>
//           </TouchableOpacity>
          
//           {stations.length > 0 ? (
//             stations.map((item) => (
//               <TouchableOpacity
//                 key={item._id}
//                 style={styles.card}
//                 onPress={() => focusOnStation(item)}
//                 activeOpacity={0.8}
//               >
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.stationName}>{item.name}</Text>
//                   <Text style={styles.address}>{item.address}</Text>
//                   <Text style={styles.meta}>Slots: {item.slots}</Text>
//                   <Text
//                     style={[
//                       styles.status,
//                       { color: item.status === "active" ? "green" : "red" },
//                     ]}
//                   >
//                     {item.status.toUpperCase()}
//                   </Text>
//                 </View>

//                 {/* Book button */}
//                 <TouchableOpacity
//                   style={styles.bookButton}
//                   onPress={() => console.log("Booking station:", item.name)}
//                 >
//                   <Text style={styles.bookText}>Book</Text>
//                 </TouchableOpacity>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text>No stations found</Text>
//           )}
//         </BottomSheetScrollView>
//       </BottomSheet>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     backgroundColor: "white",
//     paddingBottom: 50,
//     paddingHorizontal: 12,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 12,
//     marginTop: 8,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#f8f9fa",
//     padding: 14,
//     marginVertical: 8,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   stationName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#222",
//   },
//   address: {
//     fontSize: 13,
//     color: "#555",
//     marginVertical: 2,
//   },
//   meta: {
//     fontSize: 12,
//     color: "#444",
//   },
//   status: {
//     fontSize: 12,
//     fontWeight: "600",
//     marginTop: 4,
//   },
//   bookButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 8,
//   },
//   bookText: {
//     color: "white",
//     fontWeight: "600",
//   },
// });


import React, { useCallback, useRef, useMemo, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URI } from "@env";

export default function NearbyStation({ route }) {
  const navigation = useNavigation();
  const { data: stations } = route.params;
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const initialRegion = stations.length
    ? {
        latitude: stations[0].location.coordinates[1],
        longitude: stations[0].location.coordinates[0],
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : { latitude: 20, longitude: 77, latitudeDelta: 10, longitudeDelta: 10 };

  const focusOnStation = (station) => {
    setSelectedStationId(station._id);
    mapRef.current?.animateToRegion(
      {
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  // 🧮 Convert HH:MM to minutes
  const convertToMinutes = (time) => {
    const [hh, mm] = time.split(":").map(Number);
    return hh * 60 + mm;
  };

  // 🧾 Booking API
  const handleBooking = async () => {
    if (!fromTime || !toTime) {
      Alert.alert("Error", "Please enter both From and To times");
      return;
    }

    const timeFrom = convertToMinutes(fromTime);
    const timeTo = convertToMinutes(toTime);

    if (timeFrom >= timeTo) {
      Alert.alert("Invalid Time", "From time must be before To time");
      return;
    }

    try {
      setIsBooking(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`http://${BACKEND_URI}/api/stations/book-station`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stationId: currentStation._id, timeFrom, timeTo }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", data.message);
        setModalVisible(false);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while booking");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={initialRegion}  userInterfaceStyle={"light"}>
        {stations.map((station) => (
          <Marker
            key={station._id}
            coordinate={{
              latitude: station.location.coordinates[1],
              longitude: station.location.coordinates[0],
            }}
            title={station.name}
            description={station.address}
            pinColor={selectedStationId === station._id ? "blue" : "red"}
          />
        ))}
      </MapView>

      <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints} enableDynamicSizing={false} onChange={handleSheetChange}>
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>Nearby Stations</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Go Back to Home</Text>
          </TouchableOpacity>

          {stations.map((item) => (
            <TouchableOpacity key={item._id} style={styles.card} onPress={() => focusOnStation(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stationName}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.meta}>Slots: {item.slots}</Text>
                <Text style={[styles.status, { color: item.status === "active" ? "green" : "red" }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>

              {/* Book button opens modal */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => {
                  setCurrentStation(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.bookText}>Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Book Slot - {currentStation?.name}</Text>

            <TextInput placeholder="From (HH:MM)" style={styles.input} value={fromTime} onChangeText={setFromTime} placeholderTextColor="#777"/>
            <TextInput placeholder="To (HH:MM)" style={styles.input} value={toTime} onChangeText={setToTime} placeholderTextColor="#777" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#ccc" }]} onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "green" }]} onPress={handleBooking} disabled={isBooking}>
                {isBooking ? <ActivityIndicator color="white" /> : <Text style={{ color: "white" }}>Confirm</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: { backgroundColor: "white", paddingBottom: 50, paddingHorizontal: 12 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12, marginTop: 8 },
  card: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f8f9fa", padding: 14, marginVertical: 8, borderRadius: 12 },
  stationName: { fontSize: 16, fontWeight: "600", color: "#222" },
  address: { fontSize: 13, color: "#555", marginVertical: 2 },
  meta: { fontSize: 12, color: "#444" },
  status: { fontSize: 12, fontWeight: "600", marginTop: 4 },
  bookButton: { backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  bookText: { color: "white", fontWeight: "600" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalCard: { backgroundColor: "white", width: "85%", borderRadius: 15, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 12, color: "black" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  modalBtn: { flex: 1, alignItems: "center", padding: 12, borderRadius: 10, marginHorizontal: 5 },
});

 