import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Load user data from AsyncStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedAge = await AsyncStorage.getItem('age');
        const storedGender = await AsyncStorage.getItem('gender');
        const storedMedicalHistory = await AsyncStorage.getItem('medicalHistory');
        if (storedName) setName(storedName);
        if (storedAge) setAge(storedAge);
        if (storedGender) setGender(storedGender);
        if (storedMedicalHistory) setMedicalHistory(storedMedicalHistory);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    loadUserData();
  }, []);

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('age', age);
      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('medicalHistory', medicalHistory);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Age Input */}
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Gender Input */}
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      {/* Medical History Input */}
      <TextInput
        style={styles.input}
        placeholder="Past Medical History"
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        multiline
      />

      {/* Save Button */}
      <Button title="Save" onPress={saveUserData} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
