import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import MapView, {Marker} from "react-native-maps";


export default function Home(){
    return(
            <View style = {{flex: 1}}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                    latitude: 12.9716,
                    longitude: 77.5946,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                    }}>
                    <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }} title="You" />
                </MapView>

                {/* half sheet overlay */}
                <View style={styles.sheet}>
                    <View style={styles.handle}>


                        {/* Search bar */}
                        <View style={styles.searchRow}>
                            <TouchableOpacity style={styles.searchButton}>
                                <Text style={styles.searchText}>Search for location, station...</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 4 boxes features  */}
                        <View>
                            <TouchableOpacity style={styles.box}>
                                <Text style={styles.boxTitle}>Fast Charge</Text>
                                <Text style={styles.boxSub}>Quick fill</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.box}>
                                <Text style={styles.boxTitle}>Reservations</Text>
                                <Text style={styles.boxSub}>Book a slot</Text>
                            </TouchableOpacity>



                            <TouchableOpacity style={styles.box}>
                                <Text style={styles.boxTitle}>Filters</Text>
                                <Text style={styles.boxSub}>Distance/type</Text>
                            </TouchableOpacity>



                            <TouchableOpacity style={styles.box}>
                                <Text style={styles.boxTitle}>Offers</Text>
                                <Text style={styles.boxSub}>Coupons</Text>
                            </TouchableOpacity>


                        </View>
                        
                    </View>
                </View>
            </View>
        
    )
}


const styles = StyleSheet.create({
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '50%', // half-screen
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 10,
    },
    handle: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: '#E5E7EB',
      marginBottom: 12,
    },
    searchRow: {
      flexDirection: 'row',
      marginBottom: 12,
      paddingHorizontal: 6,
    },
    searchButton: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      paddingVertical: 12,
      borderRadius: 10,
      justifyContent: 'center',
      paddingHorizontal: 14,
    },
    searchText: {
      color: '#6B7280',
      fontSize: 16,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 6,
      justifyContent: 'space-between',
    },
    box: {
      width: '48%',
      height: 110,
      borderRadius: 12,
      backgroundColor: '#F9FAFB',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 12,
      marginBottom: 12,
    },
    boxTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#111827',
    },
    boxSub: {
      fontSize: 13,
      color: '#6B7280',
      marginTop: 6,
    },
  });