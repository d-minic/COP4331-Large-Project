import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerification from './pages/EmailVerification';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import BrowseScreen from './pages/BrowseScreen';
import TestScreen from './pages/TestScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}/>
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EmailVerification" component={EmailVerification} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="BrowseScreen" component={BrowseScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TestScreen" component={TestScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;