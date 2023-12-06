import React from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';

const LandingPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('./Logo.png')}
                style={styles.logo}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={() => navigation.navigate('LoginPage')}
                    color="black"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Register"
                    onPress={() => navigation.navigate('Register')}
                    color="black"
                />
            </View>
            <Image
                source={require('./sharky.png')} 
                style={styles.graphic}
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
        marginTop: 20,
    },
    buttonContainer: {
        width: 350,
        marginTop: 12,
        borderRadius: 30,
        backgroundColor: '#C3E6F2'
    },
    graphic: {
        position: 'absolute', 
        bottom: 0,            
        width: '100%',        
        height: 200,       
        resizeMode: 'cover',  
    }
});

export default LandingPage;
