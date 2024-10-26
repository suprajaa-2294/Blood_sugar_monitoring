import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date formatting

export default function Home() {
  const navigation = useNavigation(); // React Navigation hook
  const [glucoseData, setGlucoseData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prediction, setPrediction] = useState({
    last_glucose_value: null,
    prediction_before: null,
    prediction_after: null,
  });

  // Prediction Logic Based on Ranges
  const getPrediction = (glucoseValue) => {
    let prediction_before;
    let prediction_after;

    // Prediction for fasting blood sugar (before meal)
    if (glucoseValue < 54) {
      prediction_before = "Severe Hypoglycemia";
    } else if (glucoseValue >= 54 && glucoseValue < 70) {
      prediction_before = "Mild Hypoglycemia";
    } else if (glucoseValue >= 70 && glucoseValue < 100) {
      prediction_before = "Normal";
    } else if (glucoseValue >= 100 && glucoseValue < 126) {
      prediction_before = "Pre-Diabetes";
    } else {
      prediction_before = "Hyperglycemia";
    }

    // Prediction for 2 hours after eating
    if (glucoseValue < 140) {
      prediction_after = "Normal";
    } else if (glucoseValue >= 140 && glucoseValue < 200) {
      prediction_after = "Pre-Diabetes";
    } else {
      prediction_after = "Hyperglycemia";
    }

    return { prediction_before, prediction_after };
  };

  // Fetch Glucose Data
  const fetchGlucoseData = async () => {
    const CHANNEL_ID = '2653936';
    const READ_API_KEY = 'VOX5AWN9N3FW9NHB';
    const FIELD_NUMBER = 1;

    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/${FIELD_NUMBER}.json?api_key=${READ_API_KEY}&results=100`;

    try {
      const response = await axios.get(url);
      const feeds = response.data.feeds;
      const data = feeds.map(feed => parseFloat(feed.field1));
      const timestamps = feeds.map(feed => moment(feed.created_at).format('MMM D, YYYY h:mm A'));

      setGlucoseData(data);
      setTimestamps(timestamps);
      console.log('Fetched glucose data:', data);

      const lastGlucoseValue = data[data.length - 1];
      const { prediction_before, prediction_after } = getPrediction(lastGlucoseValue);

      setPrediction({
        last_glucose_value: lastGlucoseValue,
        prediction_before,
        prediction_after,
      });
    } catch (error) {
      console.error('Error fetching glucose data:', error);
      Alert.alert('Error', 'Unable to fetch glucose data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlucoseData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Unable to sign out. Please try again.');
    }
  };

  // Get recent data and timestamps for the last 5 readings
  const recentGlucoseData = glucoseData.slice(-5);
  const recentTimestamps = timestamps.slice(-5);

  // Separate the dates and times for better chart presentation
  const recentDate = moment(recentTimestamps[0]).format('MMM D, YYYY');  // Extract the common date
  const recentTimes = recentTimestamps.map(ts => moment(ts).format('h:mm A')); // Extract times

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.appTitle}>SugarFit</Text>
      </View>

      {/* Stack of Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('DoctorAppointment')}>
          <Text style={styles.optionText}>Doctor Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Info')}>
          <Text style={styles.optionText}>Info</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : recentGlucoseData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Glucose Data</Text>

          <LineChart
            data={{
              labels: recentTimes, // Display formatted times on x-axis
              datasets: [{ data: recentGlucoseData }],
            }}
            width={Dimensions.get('window').width * 0.9}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 1, // Display 1 decimal place
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chart}
          />

          {/* Display common date below the chart */}
          <Text style={styles.commonDateText}>{recentDate}</Text>

          <Text style={styles.predictionText}>
            Last glucose value: {prediction.last_glucose_value}
          </Text>
          <Text style={styles.predictionText}>
            Prediction 'Before Meals': {prediction.prediction_before}
          </Text>
          <Text style={styles.predictionText}>
            Prediction 'After Meals': {prediction.prediction_after}
          </Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  signOutButton: {
    padding: 10,
  },
  signOutText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  commonDateText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  predictionText: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
});
``
