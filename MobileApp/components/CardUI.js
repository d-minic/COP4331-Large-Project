import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CardUI() {
  const [card, setCard] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [cardList, setCardList] = useState('');
  const [user, setUser] = useState({});
  const app_name = 'smart-tooth-577ede9ea626';

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const buildPath = (route) => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  };

  const addCard = async () => {
    const obj = { userId: user.id, card: card };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/addcard'), {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (res.error.length > 0) {
        setMessage('API Error: ' + res.error);
      } else {
        setMessage('Card has been added');
      }
    } catch (error) {
      setMessage(error.toString());
    }
  };

  const searchCard = async () => {
    const obj = { userId: user.id, search: search };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/searchcards'), {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
      const _results = res.results;
      const resultText = _results.join(', ');

      setSearchResults('Card(s) have been retrieved');
      setCardList(resultText);
    } catch (error) {
      alert(error.toString());
      setSearchResults(error.toString());
    }
  };

  return (
    <View style={styles.cardUIDiv}>
      <TextInput
        style={styles.input}
        placeholder="Card To Search For"
        onChangeText={(text) => setSearch(text)}
      />
      <Button title="Search Card" onPress={searchCard} />
      <Text style={styles.result}>{searchResults}</Text>
      <Text style={styles.cardList}>{cardList}</Text>

      <TextInput
        style={styles.input}
        placeholder="Card To Add"
        onChangeText={(text) => setCard(text)}
      />
      <Button title="Add Card" onPress={addCard} />
      <Text style={styles.result}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardUIDiv: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 16,
  },
  cardList: {
    fontSize: 14,
  },
});

export default CardUI;