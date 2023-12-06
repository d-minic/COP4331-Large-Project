import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const retrieveData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData !== null) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error retrieving user data from storage', error);
            }
        };

        retrieveData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Username: {userData.username}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>First Name: {userData.firstName}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Last Name: {userData.lastName}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Email: {userData.email}</Text>
            </View>
            <Image
                source={require('./sharky.png')} 
                style={styles.graphic}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF', 
    },
    infoContainer: {
        backgroundColor: '#006994', 
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%', 
    },
    info: {
        fontSize: 18,
        color: '#FFFFFF', 
    },
    graphic: {
        position: 'absolute', 
        bottom: 0,            
        width: '100%',        
        height: 200,       
        resizeMode: 'cover',  
    }
});

export default ProfileScreen;
