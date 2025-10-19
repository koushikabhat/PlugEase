
import React, { useCallback, useRef, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URI } from "@env";

export default function MapScreen({ route }) {
  const station = route.params?.station;
  const sheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const snapPoints = useMemo(() => ["10%", "55%"], []);

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  // 🧮 Convert HH:MM into minutes
  const convertToMinutes = (time) => {
    const [hh, mm] = time.split(":").map(Number);
    return hh * 60 + mm;
  };

  // 🧾 Booking API call
  const handleBooking = async () => {
    if (!fromTime || !toTime) {
      Alert.alert("Error", "Please select both from and to times");
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stationId: station._id,
          timeFrom,
          timeTo,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log(data);
        Alert.alert(data?.message);
        setModalVisible(false);
      } else {
        Alert.alert(data?.message);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      Alert.alert("Error", "Something went wrong while booking");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: station.location?.coordinates[1],
          longitude: station.location?.coordinates[0],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapReady={() => setLoading(false)}
      >
        <Marker
          coordinate={{
            latitude: station.location?.coordinates[1],
            longitude: station.location?.coordinates[0],
          }}
          title={station.name}
        />
      </MapView>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleIndicatorStyle={{ backgroundColor: "#ccc", width: 50 }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>⬅️ Go Back</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Image
              source={require("../Assets/cards/station.png")}
              style={styles.stationImage}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{station.name}</Text>
              <Text style={styles.address}>{station.address}</Text>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.label}>🚗 Vehicles:</Text>
                <Text style={styles.value}>
                  {station.supportedVehicles.join(", ")}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>🅿️ Slots:</Text>
                <Text style={styles.value}>{station.slots}</Text>
              </View>

              <View style={styles.buttonRow}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Navigate</Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#ff5b5b" }]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.buttonText}>Book Slot</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Booking Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Book Charging Slot</Text>

            <TextInput
              style={styles.input}
              placeholder="From (HH:MM)"
              placeholderTextColor="#777"
              value={fromTime}
              onChangeText={setFromTime}
            />

            <TextInput
              style={styles.input}
              placeholder="To (HH:MM)"
              placeholderTextColor="#777"
              value={toTime}
              onChangeText={setToTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "green" }]}
                onPress={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white" }}>Confirm.</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  sheetContent: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  backText: {
    marginLeft: 15,
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 0,
    padding: 20,
  },
  stationImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginBottom: 15,
    alignSelf: "center",
  },
  infoContainer: {
    alignItems: "flex-start",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6, color: "#222" },
  address: { fontSize: 18, color: "#666", marginBottom: 12 },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 10,
  },



  row: {
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginRight: 8,
  },
  value: {
    fontSize: 15,
    color: "#333",
    flex: 1,        // <--- take remaining horizontal space
    flexWrap: "wrap", // allow wrapping if too long
  },


  
  


  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // 🔘 Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    color: "black",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});
