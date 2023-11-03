import React from 'react';
import { View, Text } from 'react-native';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';

const RegisterPage = () => {
    return (
        <View>
            <PageTitle title="Register" />
            <Register />
        </View>
    );
};

export default RegisterPage;