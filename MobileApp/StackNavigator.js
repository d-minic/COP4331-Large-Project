import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'; 
import CardPage from './CardPage'; 

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LandingPage"> 
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="RegisterPage" component={RegisterPage} />
      <Stack.Screen name="CardPage" component={CardPage} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
