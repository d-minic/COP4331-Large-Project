import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

const EmailVerification = () => {
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const app_name = 'smart-tooth-577ede9ea626';

    const doVerifyEmail = async () => {
        try {
            const response = await fetch(`https://${app_name}.herokuapp.com/api/verifyemail`, {
                method: 'POST',
                body: JSON.stringify({ login: username, verificationCode }),
                headers: { 'Content-Type': 'application/json' },
            });

            const res = await response.json();
            if (res.error) {
                setMessage(res.error);
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            setMessage("Verification Failed: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./Logo.png')} style={styles.logo} />
            <Text style={styles.innerTitle}>Please verify your email!</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={'black'}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Verification Code"
                placeholderTextColor={'black'}
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Verify Email"
                    onPress={doVerifyEmail}
                    color="#C3E6F2"
                />
            </View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
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
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        width: 350,
        marginTop: 12,
        borderRadius: 30,
    },
    message: {
        marginTop: 10,
        marginBottom: 10,
    }
});

export default EmailVerification;
