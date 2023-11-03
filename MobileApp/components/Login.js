import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            username: loginName,
            password: loginPassword,
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'), {
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
                await AsyncStorage.setItem('user_data', JSON.stringify(res));
                setMessage('');
                navigation.navigate('CardPage'); 
            }
        } catch (error) {
            setMessage(error.toString());
        }
    };

    return (
        <View id="loginDiv">
            <Text id="inner-title">PLEASE LOG IN</Text>
            <TextInput
                placeholder="Username"
                value={loginName}
                onChangeText={(text) => setLoginName(text)}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={loginPassword}
                onChangeText={(text) => setLoginPassword(text)}
            />
            <Button title="Login" onPress={doLogin} />
            <Text id="loginResult">{message}</Text>
            <Button
                title="Don't have an account? Register here"
                onPress={() => navigation.navigate('Register')} 
            />
        </View>
    );
}

export default Login;
