import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function PageTitle() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>COP 4331 MERN Stack Demo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default PageTitle;