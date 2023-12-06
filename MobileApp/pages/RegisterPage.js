import React from 'react';
import { View, Text } from 'react-native';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';

const RegisterPage = () => {
    return (
        <View style={{ display: 'flex', alignContent:'center', justifyContent:'center', flex: 1, backgroundColor: '#fff'}}>
            <Register />
        </View>
    );
};

export default RegisterPage;