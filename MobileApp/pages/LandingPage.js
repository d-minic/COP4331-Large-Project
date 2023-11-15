import React from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';
import TouchableBtn from '../components/Buttons/CustomOpacityButton';

const LandingPage = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Image
          source={require('./Logo.png')} 
          style={styles.logo}
        />
        <TouchableBtn 
             viewStyle={ styles.buttonContainer }
             touchableOpacStyle={ styles.buttonStyle }
             titleStyle={ styles.titleStyle }
             onPress={() => navigation.navigate('LoginPage')}
             Title={ 'Login' }
             borderRadius={70}
        />
        <TouchableBtn 
             viewStyle={ styles.buttonContainer }
             touchableOpacStyle={ styles.buttonStyle }
             titleStyle={ styles.titleStyle }
             onPress={() => navigation.navigate('RegisterPage')}
             Title={ 'Register' }
             borderRadius={80}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400,
    height: 100,
  },
  buttonContainer: {
    width: 350,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonStyle: {
    width: '100%',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
    backgroundColor: '#C3E6F2',
  },
});

export default LandingPage;
