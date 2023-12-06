import React, { useState } from 'react';
import { View, Image, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoImage from './Logo.png';
import { StyleSheet } from 'react-native';

function Login() {
    const navigation = useNavigation();
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const app_name = 'smart-tooth-577ede9ea626';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
    }

    const doLogin = async () => {
        const obj = {
            login: loginName,
            password: loginPassword,
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/applogin'), { // Changed API endpoint here
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const res = JSON.parse(await response.text());

            if (res.error) {
                setMessage(res.error);
            } else {
                await AsyncStorage.setItem('user_data', JSON.stringify(res)); // Directly storing the response
                setMessage('');
                navigation.navigate('HomeScreen');
            }
        } catch (error) {
            setMessage(error.toString());
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
            <Image
                source={LogoImage} 
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder="Username"
                value={loginName}
                onChangeText={setLoginName}
            />
            <TextInput
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder="Password"
                secureTextEntry={true}
                value={loginPassword}
                onChangeText={setLoginPassword}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={doLogin}
                    color="black"
                />
            </View>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Don't have an account? Register here"
                    onPress={() => navigation.navigate('Register')}
                    color="black"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 400,
        height: 100,
    },
    input: {
        width: 350,
        padding: 10,
        margin: 10,
        borderColor: '#C3E6F2',
        borderWidth: 2,
        borderRadius: 5,
    },
    buttonContainer: {
        width: 350,
        borderRadius: 30,
        backgroundColor: '#C3E6F2'
    },
    message: {
        marginTop: 1,
        marginBottom: 1,
    },
    backButton: {
        position: 'absolute',
        top: 450,
        left: 10,
        padding: 10,
    },
    backButtonText: {
        color: 'black',
        textDecorationLine: 'underline',
    },
});

export default Login;
