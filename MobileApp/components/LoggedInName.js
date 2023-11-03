import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoggedInName() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      // Redirect to the login screen or navigate as needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.loggedInDiv}>
      <Text style={styles.userName}>Logged In As {user.firstName} {user.lastName}</Text>
      <Button title="Log Out" onPress={doLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  loggedInDiv: {
    alignItems: 'center',
    padding: 10,
  },
  userName: {
    fontSize: 16,
  },
});

export default LoggedInName;