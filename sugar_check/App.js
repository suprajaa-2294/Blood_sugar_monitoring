// App.js or wherever your navigation is set up

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'; // Import Home screen
import Profile from './profile'; // Import Profile screen
import Login from './Login'; // Assuming there's a Login screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
