import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

const TestScreen = ({ route, navigation }) => {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [sharkFact, setSharkFact] = useState('');
  const [loading, setLoading] = useState(true);
  const app_name = 'smart-tooth-577ede9ea626';

  const buildPath = (route) => {
    return `https://${app_name}.herokuapp.com/${route}`;
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(buildPath(`api/getquestions`), {
        method: 'POST',
        body: JSON.stringify({ id: testId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();
      if (!res.error) {
        setQuestions(res.results);
      } else {
        Alert.alert('Error', 'Failed to load questions.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      Alert.alert("Incomplete Test", "Please answer all questions before submitting.");
      return;
    }

    let correctAnswersCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question._id] === question.CorrectAnswer) {
        correctAnswersCount++;
      }
    });
  
    const testScore = (correctAnswersCount / questions.length) * 100;
    setScore(testScore);
  

    try {
        const userData = await AsyncStorage.getItem('user_data');
        const { _id } = JSON.parse(userData);
  
        const response = await fetch(buildPath('api/completetest'), {
          method: 'POST',
          body: JSON.stringify({ id: _id, testId: testId }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          setIsTestCompleted(true);
          setScore(testScore);
          
          const factResponse = await fetch(buildPath('api/getsharkfact'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          const factResult = await factResponse.json();
          setSharkFact(factResult.results);
  
          const pointsResponse = await fetch(buildPath('api/addpoints'), {
            method: 'POST',
            body: JSON.stringify({ id: _id, points: Math.round(testScore * 0.1) }),
            headers: { 'Content-Type': 'application/json' },
          });

        } else {
          Alert.alert("Error", "Failed to complete the test.");
        }
      } catch (error) {
        console.error('Error completing test:', error);
      }
    };
  

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.Question}</Text>
              {question.Answers.map((answer, ansIndex) => (
                <TouchableOpacity
                  key={ansIndex}
                  onPress={() => {
                    const newSelectedAnswers = { ...selectedAnswers };
                    newSelectedAnswers[question._id] = answer;
                    setSelectedAnswers(newSelectedAnswers);
                  }}
                  style={[styles.answerButton, { backgroundColor: selectedAnswers[question._id] === answer ? '#add8e6' : 'white' }]}>
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity onPress={handleSubmitTest} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Test</Text>
      </TouchableOpacity>
      {isTestCompleted && (
        <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>Score: {score}%</Text>
            <Text style={styles.resultsText}>Shark Fact: {sharkFact}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    backgroundColor: '#006994',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 30,
  },
  questionContainer: {
    marginBottom: 30,
    borderColor: '#006994',
    backgroundColor: '#C3E6F2', 
    borderRadius: 10,
    padding: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1, 
    borderColor: 'black',
    backgroundColor: 'transparent', 
  },
  selectedAnswerButton: {
    backgroundColor: 'white', 
  },
  answerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2, 
    borderRadius: 5,
    margin: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#C3E6F2', 
    borderRadius: 10,
    borderWidth: 2, 
    borderColor: 'black', 
    margin: 10,
  },
  resultsText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TestScreen;