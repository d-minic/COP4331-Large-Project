import React from 'react';
import { View } from 'react-native';
import PageTitle from '../components/PageTitle';
import Login from './Login';

const LoginPage = () => {
    return (
        <View style={{ display: 'flex', alignContent:'center', justifyContent:'center', flex: 1, backgroundColor: '#fff'}}>
            <Login />
        </View>
    );
};

export default LoginPage;