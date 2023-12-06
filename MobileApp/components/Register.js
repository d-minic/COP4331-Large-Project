import React, { useState } from 'react';
import { View, Image, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoImage2 from './Logo2.png';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Register() {
    const [registerFirstName, setRegisterFirstName] = useState('');
    const [registerLastName, setRegisterLastName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const app_name = 'smart-tooth-577ede9ea626';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
    }

    const doRegister = async () => {
        const obj = {
            firstName: registerFirstName,
            lastName: registerLastName,
            email: registerEmail,
            login: registerUsername,
            password: registerPassword,
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/register'), {
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
                const emailResponse = await fetch(buildPath('api/sendemail'), {
                    method: 'POST',
                    body: JSON.stringify({ email: registerEmail, login: registerUsername }),
                    headers: { 'Content-Type': 'application/json' },
                });
    
                let emailRes = await emailResponse.json();
    
                if (emailRes.error) {
                    setMessage('Registration successful but unable to send verification email.');
                } else {
                    setMessage('Registration successful! Please check your email to verify.');

                    await AsyncStorage.setItem('userData', JSON.stringify({
                        username: registerUsername,
                        firstName: registerFirstName,
                        lastName: registerLastName,
                        email: registerEmail
                    }));
                    
                    navigation.navigate('EmailVerification');
                }
            }
        } catch (error) {
            setMessage("Registration Failed: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.innerTitle}></Text>
            <Image
                source={LogoImage2} 
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={'black'}
                value={registerFirstName}
                onChangeText={setRegisterFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={'black'}
                value={registerLastName}
                onChangeText={setRegisterLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'black'}
                value={registerEmail}
                onChangeText={setRegisterEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={'black'}
                value={registerUsername}
                onChangeText={setRegisterUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={'black'}
                secureTextEntry={true}
                value={registerPassword}
                onChangeText={setRegisterPassword}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Register"
                    onPress={doRegister}
                    color="black"
                />
            </View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        marginTop: 12,
        borderRadius: 30,
        backgroundColor: '#C3E6F2',
    },
    message: {
        marginTop: 10,
        marginBottom: 10,
    }
});

export default Register;
