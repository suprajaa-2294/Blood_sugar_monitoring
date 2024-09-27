//login.js

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase'; // Ensure the path is correct
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';  // Import navigation hook

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();  // Initialize navigation

  const handleLogin = async () => {
    console.log("Login button clicked!");
    setIsLoading(true);
    setError('');

    // Check for empty fields
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password.');
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching user data from Firestore...");
      const userRef = doc(db, 'users', username); // Fetch user by username
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User data:", userData);

        if (userData.password === password) {
          Alert.alert('Success', 'Login successful!');
          console.log("Login successful!");
          navigation.navigate('Home');  // Navigate to Home screen upon successful login
        } else {
          setError('Invalid username or password.');
          console.log("Invalid username or password.");
        }
      } else {
        setError('User does not exist.');
        console.log("User does not exist.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred while trying to log in.');
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>SugarFit</Text>

      {/* Center Image */}
      <Image source={require('./assets/sugar1.jpg')} style={styles.centerImage} />

      {/* Login Page Title */}
      <Text style={styles.loginText}>Login Page</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7F7F7F"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7F7F7F"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Sign-up Prompt */}
      <Text style={styles.signUpPrompt}>New user? Sign up below:</Text>
      <Text style={styles.signUpLink}>Sign up here</Text>

      {/* Logo in the Top Right */}
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 30,
    right: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  centerImage: {
    width: 300,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loginText: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  signUpPrompt: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
  },
  signUpLink: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});