import React from 'react';
import { View } from 'react-native';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/CardUI';

const CardPage = () => {
    return (
        <View>
            <PageTitle />
            <LoggedInName />
            <CardUI />
        </View>
    );
};

export default CardPage;