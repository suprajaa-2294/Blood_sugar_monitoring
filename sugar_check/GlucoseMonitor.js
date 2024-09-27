// GlucoseMonitor.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Glucose monitoring screen
function GlucoseMonitor() {
  const [glucoseLevel, setGlucoseLevel] = useState(0);

  // Function to generate random glucose level between 90 and 130
  const generateRandomGlucoseLevel = () => {
    const randomLevel = Math.floor(Math.random() * (130 - 90 + 1)) + 90;
    setGlucoseLevel(randomLevel);
  };

  useEffect(() => {
    generateRandomGlucoseLevel(); // Generate a random level on load
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Glucose</Text>
      <View style={styles.glucoseContainer}>
        <Text style={styles.glucoseText}>{glucoseLevel} mg/dL</Text>
        <Text>GLUCOSE IN RANGE</Text>
      </View>
      <Button title="Refresh Glucose Level" onPress={generateRandomGlucoseLevel} />
    </View>
  );
}

// Styles for glucose monitoring page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  glucoseContainer: {
    backgroundColor: '#9FE2BF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  glucoseText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default GlucoseMonitor;
