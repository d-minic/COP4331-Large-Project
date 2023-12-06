import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const BrowseScreen = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const app_name = 'smart-tooth-577ede9ea626';
  const navigation = useNavigation();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const { _id } = JSON.parse(userData);

        const response = await fetch(`https://${app_name}.herokuapp.com/api/searchtests`, {
          method: 'POST',
          body: JSON.stringify({ search: '', id: _id }),
          headers: { 'Content-Type': 'application/json' },
        });
        const res = await response.json();
        if (!res.error) {
          setTests(res.results);
        }
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = async (testId) => {
    await AsyncStorage.setItem('selected_test_id', testId);
    navigation.navigate('TestScreen', { testId: testId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleTestSelect(item._id.toString())}>
    <View style={styles.testContainer}>
    <Text style={styles.testName}>{item.Name}</Text>
      {/* Additional test details can be displayed here */}
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading tests...</Text>
      ) : (
        <FlatList
          data={tests}
          keyExtractor={item => item._id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006994', 
  },
  testContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#C3E6F2',
    backgroundColor: '#C3E6F2', 
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BrowseScreen;
