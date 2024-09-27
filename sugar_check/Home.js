import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { LineChart } from 'react-native-chart-kit'; // Import LineChart
import { Dimensions, ScrollView } from 'react-native'; // Import ScrollView for scrollable content

export default function Home() {
  const navigation = useNavigation();

  const [glucoseData, setGlucoseData] = useState([]);

  useEffect(() => {
    // Generate random glucose data for the graph
    const generateRandomData = () => {
      let data = [];
      for (let i = 0; i < 12; i++) {
        data.push(Math.floor(Math.random() * 100) + 70); // random glucose values between 70 and 170
      }
      setGlucoseData(data);
    };
    generateRandomData();
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('Profile'); // Navigate to Profile screen
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navigate back to the Login page
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Unable to sign out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo and App Title */}
      <View style={styles.header}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} /> {/* Change path if needed */}
        <Text style={styles.appTitle}>Glucose Monitor</Text>
      </View>

      {/* Top Section with Profile and Sign-Out */}
      <View style={styles.topButtons}>
        <Button title="Profile" onPress={handleProfilePress} style={styles.profileButton} />
        <Button title="Sign Out" onPress={handleSignOut} style={styles.signOutButton} />
      </View>

      {/* Glucose Reading Section */}
      <View style={styles.readingContainer}>
        <View style={styles.glucoseReading}>
          <Text style={styles.glucoseNumber}>112</Text>
          <Text style={styles.unit}>mg/dL</Text>
          {/* Added line indicating glucose level is normal */}
          <Text style={styles.normalText}>Glucose level in range and normal</Text>
        </View>
        <View style={styles.trendArrow}>
          <Text style={styles.trendText}>↗</Text>
        </View>
      </View>

      {/* Graph Display Section */}
      <View style={styles.graphContainer}>
        <LineChart
          data={{
            labels: ['3PM', '4PM', '5PM', '6PM', '7PM', '8PM'], // Labels for the graph
            datasets: [{ data: glucoseData }], // Random glucose data
          }}
          width={Dimensions.get('window').width - 40} // Graph width
          height={220}
          yAxisSuffix="mg/dL"
          chartConfig={{
            backgroundColor: '#E8F5E9',
            backgroundGradientFrom: '#E8F5E9',
            backgroundGradientTo: '#E8F5E9',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`, // Green color for the graph line
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#2E7D32' },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Add Note Section */}
      <TouchableOpacity style={styles.addNoteButton} onPress={() => Alert.alert('Add Note Clicked')}>
        <Text style={styles.addNoteText}>+ ADD NOTE</Text>
      </TouchableOpacity>

      {/* Sensor Info Section */}
      <View style={styles.sensorInfoContainer}>
        <Text style={styles.sensorInfoText}>SENSOR ENDS IN: 14 DAYS</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F4F9',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  profileButton: {
    marginRight: 10,
  },
  signOutButton: {
    marginLeft: 10,
  },
  readingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  glucoseReading: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
  },
  glucoseNumber: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  unit: {
    fontSize: 18,
    color: '#555',
  },
  normalText: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 5,
  },
  trendArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 40,
    color: '#2E7D32',
  },
  graphContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  addNoteButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  addNoteText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sensorInfoContainer: {
    padding: 10,
    marginBottom: 30,
  },
  sensorInfoText: {
    color: '#555',
    fontSize: 16,
  },
});
