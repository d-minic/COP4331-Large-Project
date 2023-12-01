import React from 'react';
import { View, Button } from 'react-native';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import { useNavigation } from '@react-navigation/native';

const RegisterPage = () => {

    const navigation = useNavigation();

    return (
        <View>
            <Button
            title = "Go to Register Page"
            onPress={()=> navigation.navigate('RegisterPage')}
            />
        </View>
    );
};

export default RegisterPage;
