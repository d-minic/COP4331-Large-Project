import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

function Register() {
    const [registerFirstName, setRegisterFirstName] = useState('');
    const [registerLastName, setRegisterLastName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [message, setMessage] = useState('');
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
            username: registerUsername,
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
                setMessage('Registration successful! You can now log in.');

                setRegisterFirstName('');
                setRegisterLastName('');
                setRegisterUsername('');
                setRegisterPassword('');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <View>
            <Text id="inner-title">REGISTER</Text>
            <TextInput
                placeholder="First Name"
                value={registerFirstName}
                onChangeText={(text) => setRegisterFirstName(text)}
            />
            <TextInput
                placeholder="Last Name"
                value={registerLastName}
                onChangeText={(text) => setRegisterLastName(text)}
            />
            <TextInput
                placeholder="Username"
                value={registerUsername}
                onChangeText={(text) => setRegisterUsername(text)}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry={true}
                value={registerPassword}
                onChangeText={(text) => setRegisterPassword(text)}
            />
            <Button title="Register" onPress={doRegister} />
            <Text id="registerResult">{message}</Text>
        </View>
    );
}

export default Register;
