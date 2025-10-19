

import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { BACKEND_URI } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profile() {
  const { LogOut } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editField, setEditField] = useState(null); // "name" | "email" | null

  const profileImg = require('../Assets/CarAndScooty/car.png');

  // ✅ Fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`http://${BACKEND_URI}/api/user/get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const u = data.data;
        setUser(u);
        setName(u.Name || '');
        setEmail(u.Email || '');
        setPhone(u?.PhoneNumber);
        console.log("phone number from the backend is .............",u.PhoneNumber);
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.log('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchUserProfile();
  }, [isFocused]);

  // ✅ Update user field in DB
  const updateUserField = async (field, value) => {
    if (!value) return Alert.alert('Error', `${field} cannot be empty.`);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`http://${BACKEND_URI}/api/user/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field === 'name' ? 'Name' : 'Email']: value,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        Alert.alert('Success', `${field} updated successfully!`);
      } else {
        Alert.alert('Error', data.message || 'Update failed.');
      }
    } catch (err) {
      console.log('Update error:', err);
    }
  };

  const handleEditToggle = async (field) => {
    // If already in edit mode and Save is clicked
    if (editField === field) {
      const value = field === 'name' ? name : email;
      await updateUserField(field, value);
      setEditField(null); // turn back to Edit
    } else {
      // Enable edit mode for that field
      setEditField(field);
    }
  };

  const handleLogOut = () => {
    try {
      LogOut();
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    }
  };

  if (loading && !user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0C2964" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity>
          <Image source={profileImg} style={styles.profileImage} />
          <Text style={styles.changePhoto}>Change Photo</Text>
        </TouchableOpacity>

        {/* Name */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={name}
            editable={editField === 'name'}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <TouchableOpacity onPress={() => handleEditToggle('name')}>
            <Text style={styles.editText}>
              {editField === 'name' ? '✅ Save' : '✏️ Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={email}
            editable={editField === 'email'}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => handleEditToggle('email')}>
            <Text style={styles.editText}>
              {editField === 'email' ? '✅ Save' : '✏️ Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phone (read-only) */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: '#f0f0f0' }]}
            value={phone}
            editable={false}
            // placeholder="Phone number"
          />
        </View>

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
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color : "black"
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  editText: {
    color: '#0C2964',
    fontSize: 15,
    fontWeight: '600',
  },
  options: {
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

