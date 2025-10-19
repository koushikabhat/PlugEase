import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URI } from "@env";
import { useNavigation } from "@react-navigation/native";

export default function SearchStations({ route }) {
  const { vehicleType: routeVehicleType } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [status, setStatus] = useState(null); // "active" / "inactive"
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [vehicleType, setVehicleType] = useState(routeVehicleType || null); // "car" / "scooty"
  const [datafound, setDatafound] = useState(false);
  const stationImage = require("../Assets/cards/station.png");

  const navigation = useNavigation();

  // Helper function: Convert minutes to HH:MM
  const formatMinutesToHHMM = (totalMinutes) => {
    if (totalMinutes === undefined || totalMinutes === null) return "--:--";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(
        `http://${BACKEND_URI}/api/stations/search-stations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            place: query,
            status,
            slots: onlyAvailable ? 1 : undefined,
            supportedVehicles: vehicleType,
          }),
        }
      );
      const data = await res.json();
      if (data) setDatafound(true);
      if (data.success) {
        setResults(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.card, selectedStation === index && styles.selectedCard]}
      onPress={() => setSelectedStation(index)}
    >
      {/* Left Image */}
      <Image source={stationImage} style={styles.cardImage} />

      {/* Right Content */}
      <View style={styles.cardTextContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "active"
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.cardAddress} numberOfLines={1}>
          {item.address}
        </Text>

        <Text style={styles.cardDetails}>
          🚗 {item.supportedVehicles.join(", ")}
        </Text>

        <Text style={styles.cardSlots}>Slots: {item.slots}</Text>

        <Text style={{ marginTop: 4 }}>
          Time: {formatMinutesToHHMM(item.opensAt)} to {formatMinutesToHHMM(item.closesAt)}
        </Text>

        <TouchableOpacity
          style={{ marginTop: 8 }}
          onPress={() => navigation.navigate("MapScreen", { station: item })}
        >
          <Text style={{ fontWeight: "bold" }}>Show on map</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "darkgreen" }}>
          Loading map...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top bar with Back Button + Search Box */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Search places..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity onPress={fetchResults} style={styles.searchButton}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      {Array.isArray(results) && results.length > 0 && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterButtonText}>⚙️ Apply Filters</Text>
        </TouchableOpacity>
      )}

      {/* Results */}
      {Array.isArray(results) && results.length > 0 && (
        <FlatList
          style={{ marginTop: 10 }}
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, idx) => idx.toString()}
        />
      )}

      {/* No station */}
      {datafound && !loading && Array.isArray(results) && results.length === 0 && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "#555" }}>No Station Found</Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Stations</Text>

            {/* Status */}
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.option, status === "active" && styles.optionSelected]}
                onPress={() => setStatus((prev) => (prev === "active" ? null : "active"))}
              >
                <Text style={{ textAlign: "center", flexShrink: 0 }}>Active.</Text>

              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, status === "inactive" && styles.optionSelected]}
                onPress={() => setStatus((prev) => (prev === "inactive" ? null : "inactive"))}
              >
                <Text>Inactive.</Text>
              </TouchableOpacity>
            </View>

            {/* Availability */}
            <Text style={styles.filterLabel}>Availability</Text>
            <TouchableOpacity
              style={[styles.option, onlyAvailable && styles.optionSelected]}
              onPress={() => setOnlyAvailable(!onlyAvailable)}
            >
              <Text>Only Available</Text>
            </TouchableOpacity>

            {/* Vehicle Type */}
            <Text style={styles.filterLabel}>Vehicle Type</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.option, vehicleType === "car" && styles.optionSelected]}
                onPress={() => setVehicleType((prev) => (prev === "car" ? null : "car"))}
              >
                <Text style={{ textAlign: "center" }}>Car</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, vehicleType === "scooty" && styles.optionSelected]}
                onPress={() => setVehicleType((prev) => (prev === "scooty" ? null : "scooty"))}
              >
                <Text style={{ textAlign: "center" }}>Bike</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ddd" }]}
                onPress={() => setFilterVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#007AFF" }]}
                onPress={() => {
                  setFilterVisible(false);
                  fetchResults();
                }}
              >
                <Text style={{ color: "#fff" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  topBar: {
    marginTop: 40,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 6,
  },
  backArrow: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
  },
  searchButton: { marginLeft: 8, padding: 6 },

  filterButton: {
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    width: 140,
    height: 40,
  },
  filterButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 18,
    marginVertical: 6,
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    height: 150,
  },
  selectedCard: { borderColor: "#007AFF" },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: "#f2f2f2",
  },
  cardTextContainer: { flex: 1, justifyContent: "center" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#222", flex: 1, marginRight: 10, flexWrap: "wrap" },
  cardAddress: { fontSize: 14, color: "#555", marginBottom: 2, flexWrap: "wrap" },
  cardDetails: { fontSize: 13, color: "#333", marginBottom: 2, flexWrap: "wrap" },
  cardSlots: { fontSize: 13, color: "#555" },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeBadge: { backgroundColor: "#d4f4dd" },
  inactiveBadge: { backgroundColor: "#f8d4d4" },
  statusText: { fontSize: 12, fontWeight: "bold", color: "#555" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  filterLabel: { marginTop: 15, fontWeight: "bold", color: "#333" },
  row: { flexDirection: "row", marginTop: 8 },
  // option: { 
  //   paddingVertical: 10,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 8,
  //   marginRight: 10,
  //   minWidth: 80,       // ensures enough space for text
  //   alignItems: "center" // center text horizontally
  // },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,  // more space
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 10,
    minWidth: 90,           // slightly larger
    alignItems: "center",
    justifyContent: "center" // center text vertically
  },
  optionSelected: { backgroundColor: "#e0f0ff", borderColor: "#007AFF" },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
});
