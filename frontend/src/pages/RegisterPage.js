import React from 'react';

import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import { useNavigation } from '@react-navigation/native';

const RegisterPage = () => {

    const navigation = useNavigation();

    return (
        <div>
            <Button
            title="Go to Register Page"
            onClick={() => navigation.navigate('RegisterPage')}
            />
        </div>
    );
};

export default RegisterPage;
