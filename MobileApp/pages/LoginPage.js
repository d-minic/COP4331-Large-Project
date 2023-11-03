import React from 'react';
import { View } from 'react-native';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';

const LoginPage = () => {
    return (
        <View>
            <PageTitle />
            <Login />
        </View>
    );
};

export default LoginPage;