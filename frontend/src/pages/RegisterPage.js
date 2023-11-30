import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register'; // Assuming this is the correct path

const RegisterPage = () => {
  const navigation = useNavigation();

  const handleRegistration = () => {
    // Handle registration logic if needed
    console.log('Registration button pressed');
  };

  return (
    <View style={styles.container}>
      <PageTitle title="Register" />
      <Register />
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="First Name" />
        <TextInput style={styles.input} placeholder="Last Name" />
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Username" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
        <Button title="Register" onPress={handleRegistration} />
      </View>
      <Text>Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('LoginPage')}>Log in here</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegisterPage;
