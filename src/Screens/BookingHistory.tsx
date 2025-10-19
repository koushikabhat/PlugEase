

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
// import { BACKEND_URI } from "@env";
// import { useIsFocused } from '@react-navigation/native';


// function BookingHistory() {
//   const [bookings, setBookings] = useState([]); // ✅ store bookings in state
//   const [loading, setLoading] = useState(true);

//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) fetchData();
//   }, [isFocused]);


//   const fetchData = async () => {
//     console.log("Inside fetchData");
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       if (!token) {
//         Alert.alert("No token found. Please log in again.");
//         return;
//       }

//       const res = await fetch(`http://${BACKEND_URI}/api/usersbooking/get-bookings`, {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log(data);

//       if (data?.success) {
//         console.log("Bookings:", data);
//         setBookings(data?.data);
//       } else {
//         Alert.alert(data?.message);
//       }
//     } catch (error) {
//       console.log("Error occurred at Booking History:", error);
//       Alert.alert("Something went wrong while fetching bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Booking History</Text>

//       {loading ? (
//         <Text style={styles.loading}>Loading...</Text>
//       ) : bookings.length === 0 ? (
//         <Text style={styles.noData}>No bookings found</Text>
//       ) : (
//         <ScrollView>
//           {bookings.map((item, index) => (
//             <View key={index} style={styles.card}>
//               <Text style={styles.title}>{item.stationId?.name || "Unknown Station"}</Text>
//               <Text>{item.stationId?.address}</Text>
//               <Text>From: {item?.time?.fromTime}</Text>
//               <Text>To: {item?.time?.toTime}</Text>
//               {/* <Text>Status: {item.status}</Text> */}
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//     // <Text>Booking data</Text>
//   );
// }

// export default BookingHistory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   loading: {
//     textAlign: "center",
//     marginTop: 20,
//   },
//   noData: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#888",
//   },
//   card: {
//     backgroundColor: "white",
//     padding: 12,
//     marginVertical: 6,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 4,
//   },
// });


import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BACKEND_URI } from "@env";
import { useIsFocused } from "@react-navigation/native";

// Helper to convert minutes → hh:mm AM/PM
const formatTime = (minutes) => {
  if (minutes === undefined || minutes === null) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = ((hours + 11) % 12) + 1;
  return `${formattedHours}:${mins.toString().padStart(2, "0")} ${suffix}`;
};

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);

  const fetchData = async () => {
    console.log("Inside fetchData");
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }

      const res = await fetch(
        `http://${BACKEND_URI}/api/usersbooking/get-bookings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data?.success) {
        setBookings(data?.data || []);
      } else {
        // Alert.alert(data?.message || "No bookings found.");
        console.log("No bookings found", data?.message);
      }
    } catch (error) {
      console.log("Error occurred at Booking History:", error);
      Alert.alert("Something went wrong while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>⚡ Booking History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          {/* <Ionicons name="calendar-outline" size={64} color="#bbb" /> */}
          <Text style={styles.noData}>No bookings yet</Text>
          <Text style={styles.noDataSub}>Your past and upcoming bookings will appear here.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {bookings.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                {/* <Ionicons name="location-outline" size={22} color="#007bff" /> */}
                <Text style={styles.stationName}>
                  {item.stationId?.name || "Unknown Station"}
                </Text>
              </View>
              <Text style={styles.addressText}>{item.stationId?.address}</Text>

              <View style={styles.row}>
                {/* <Ionicons name="time-outline" size={18} color="#555" /> */}
                <Text style={styles.timeText}>
                  {formatTime(item?.time?.fromTime)} → {formatTime(item?.time?.toTime)}
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.statusBadge}>
                  {item.stationId?.status === "active" ? "Active" : "Inactive"}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default BookingHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginLeft: 6,
  },
  addressText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 28,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 2,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  statusBadge: {
    backgroundColor: "#e6f2ff",
    color: "#007bff",
    fontWeight: "500",
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dateText: {
    color: "#777",
    fontSize: 13,
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
    color: "#007bff",
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  noData: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginTop: 12,
  },
  noDataSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
