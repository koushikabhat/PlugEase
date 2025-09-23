
import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker'; // For selecting profile image
import { AuthContext } from '../Context/AuthContext';



function Profile() {
  const { LogOut } = useContext(AuthContext);

  // Profile states (you can load these from backend / AsyncStorage)
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [profileImage, setProfileImage] = useState(null);

  // Select profile image
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setProfileImage(uri); // Save image to state
      }
    });
  };

  const handleLogOut = async () => {
    try {
      LogOut();
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Something went wrong during logout.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        


        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../Assets/CarAndScooty/car.png')}
            style={styles.profileImage}
          />
          <Text style={styles.changePhoto}>Change Photo</Text>
        </TouchableOpacity>

       
       

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />


        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />


        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
        />

        
        {/* <View style={styles.options}>
          <TouchableOpacity>
            <Text style={styles.optionText}>About Us</Text>
          </TouchableOpacity>


          <TouchableOpacity>
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          
        </View> */}

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

      </View>

      
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePhoto: {
    color: '#0C2964',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  options: {
    // borderColor: "black",
    // borderWidth: 1,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#0C2964',
    marginVertical: 10,
    fontWeight: '500',
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#0C2964',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  optionRow: {
  width: '100%',
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},
});

