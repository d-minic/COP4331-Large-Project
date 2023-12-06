import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ExamPage.module.css'; // Import the CSS file
import './navbar.css';
import logo from './smarttoothlesspixel.PNG'; 

const Exam = () => {


  const [questions, setQuestions] = useState([]);
  const [questionInfo, setQuestionInfo] = useState({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [score, setScore] = useState(null); // Initialize score state
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [completionMessage, setCompletionMessage] = useState('');
  const [sharkFact, setSharkFact] = useState('');
  const [points, setPoints] = useState(0);
  const [testName, setTestName] = useState('');

  const storedTestId = JSON.parse(localStorage.getItem('testId')) || {};
  const storedUserData = JSON.parse(localStorage.getItem('user_data')) || {};
  const userId = storedUserData.id;
  const testId = storedTestId.testId;
  console.log(testId);

  const navigate = useNavigate();
  const app_name = 'smart-tooth-577ede9ea626'

  function buildPath(route)
  {
      if (process.env.NODE_ENV === 'production')
      {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      }
      else
      {
        return 'http://localhost:5000/' + route;
      }
  }

  const fetchUserInfo = async () => {
    try {
      const obj = {
        id: userId,
      };
      const js = JSON.stringify(obj);

      const response = await fetch(buildPath('api/getuserinfo'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });



      if (response.ok) {
        const result = await response.json();       
        setPoints(result.results.Points);
        // Other info here if we need it
      } else {
        console.error('Failed to fetch user information');
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };


  const handleAnswerClick = async (questionId, selectedAnswer) => {
  
    if (isTestCompleted) {
      return;
    }
  
    const correctAnswer = questionInfo[questionId]?.correctAnswer; 
  try
  {
    const obj = 
    {
      id: userId,
      testId:  testId,
      questionId: questionId,
      correct: selectedAnswer === correctAnswer,
    };
    var js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/answerquestion'), {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log('Answer submitted:', result);
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: selectedAnswer,
    }));

    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const fetchSharkFact = async () => {
    try {
      var js = JSON.stringify({});
      const response = await fetch(buildPath('api/getsharkfact'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setSharkFact(result.results);
      } else {
        console.error('Failed to fetch shark fact');
      }
    } catch (error) {
      console.error('Error fetching shark fact:', error);
    }
  };

  const addPoints = async (pointsToAdd) => {
    try {
      var js = JSON.stringify({id:userId,points: pointsToAdd});
      const response = await fetch(buildPath('api/addpoints'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setPoints((prevPoints) => prevPoints + pointsToAdd);
      } else {
        console.error('Failed to fetch shark fact');
      }
    } catch (error) {
      console.error('Error fetching shark fact:', error);
    }
  };

  const handleDeleteTest = async () => {
    const userConfirmed = window.confirm('Are you sure you want to delete this test?');

  if (!userConfirmed) {
    return; // Do nothing if the user cancels the deletion
  }
    try {
      const obj = {
        id: userId,
        testId: testId,
        owner:true
      };
      const js = JSON.stringify(obj);
      console.log(js);
  
      const response = await fetch(buildPath('api/deletetest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Delete Test:', result);
      navigate('/home');
  
      // Add any additional logic you need after deleting the test
  
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleCompleteTest = async () => {


    const allQuestionsAnswered = questions.every((question) => selectedAnswers[question._id]);

    if (!allQuestionsAnswered) {
      setCompletionMessage("Please answer all questions before completing the test."); 
      return;
    }


    // Call the endpoint to complete the test
    try {
      
      var obj = 
      {
        id: userId,
        testId: testId
      };
      var js = JSON.stringify(obj);
  
      var response = await fetch(buildPath('api/completetest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Test completed:', result);
      setIsTestCompleted(true);
      setScore(result.score);
      setCompletionMessage(`Test completed. Your score: ${Math.round(result.score)}%`);
      await fetchSharkFact();
      await addPoints(Math.round(result.score*0.1));


    } catch (error) {
      console.error('Error completing test:', error);
      
    }
  };

  useEffect(() => {
    // Fetch questions from the 'getquestions' endpoint when the component mounts
    const fetchQuestions = async () => {

    var obj = {id: testId};
    var js = JSON.stringify(obj);
      try 
      {
        const response = await fetch(buildPath('api/getquestions'),
        {method:'POST',body:js,headers:{'Content-Type':
        'application/json'}});
        const data = await response.json();
        setQuestions(data.results);
        console.log(data);
        setTestName(data.name);
        const info = {};
        data.results.forEach((question) => {
          info[question._id] = {
            numberAnswers: question.NumberAnswers,
            correctAnswer: question.CorrectAnswer,
            subject: question.Subject,
          };

        setQuestionInfo(info);
        });
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    const fetchInitialUserInfo = async () => {
      await fetchUserInfo();
    };

    fetchQuestions();
    fetchInitialUserInfo();
  }, []);

  const handleClearTest = async() => {
    // Clear selected answers and remove the selected-answer class
    setSelectedAnswers({});
    const answerItems = document.querySelectorAll(`.${styles.answerItem}`);
    answerItems.forEach((item) => {
      item.classList.remove(styles['selected-answer']);
      item.classList.remove(styles['correct-answer']);
      item.classList.remove(styles['incorrect-answer']);
    });
  
    // Reset test completion state
    setIsTestCompleted(false);
  
    // Clear the score
    setScore(null);

    setCompletionMessage('');
    try {
      const obj = {
        id: userId,
        testId:  testId
      };
      const js = JSON.stringify(obj);
  
      const response = await fetch(buildPath('api/cleartest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Clear test:', result);
  
    } catch (error) {
      console.error('Error clearing test:', error);
    }

  };

  return (
    
    <div>
        <nav class="navbar">
      <ul class = "navbarul">
          <img class = "navbarimg" src={logo} height="80"></img>
          <li class = "navbarli"><a class = "navbara" href="/">Logout</a></li>
          <li class = "navbarli"><a class = "navbara" href="EditProfile">Profile</a></li>
          <li class = "navbarli"><a class = "navbara" href="Friends">Friends</a></li>
          <li class = "navbarli"><a class = "navbara" href="Leaderboard">Leaderboard</a></li>
          <li class = "navbarli"><a class = "navbara" href="Browse">Browse</a></li>
          <li class = "navbarli"><a class = "navbara" href="AddTest">Create</a></li>
          <li class = "navbarli"><a class = "navbara" href="home">Home</a></li>
          
      </ul>
        </nav>
      <h1 className={styles.examTitle}>{testName}</h1>
      {questions.map((question) => (
        <div key={question._id} className={styles.questionContainer}>
          <h3 className={styles.questionTitle}>{question.Question}</h3>
          <ul className={styles.answerList}>
            {question.Answers.map((answer, index) => (
              <li
                key={index}
                onClick={() => handleAnswerClick(question._id, answer)}
                className={`${styles.answerItem} ${
                  !isTestCompleted && selectedAnswers[question._id] === answer
                    ? styles['selected-answer']
                    : ''
                }${
                  isTestCompleted &&
                  selectedAnswers[question._id] === answer &&
                  questionInfo[question._id]?.correctAnswer === answer
                    ? styles['correct-answer']
                    : ''
                }${
                  isTestCompleted &&
                  selectedAnswers[question._id] === answer &&
                  questionInfo[question._id]?.correctAnswer !== answer
                    ? styles['incorrect-answer']
                    : ''
                }`}
              >
                {answer}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={handleCompleteTest}
        disabled={isTestCompleted}
        className={styles.button}
      >
        {isTestCompleted ? 'Test Completed' : 'Complete Test'}
      </button>
      <button onClick={handleClearTest} className={styles.button}>
        Clear Test
      </button>
      <button onClick={handleDeleteTest} className={styles.button}>
        Delete Test
      </button>
      {completionMessage && <p>{completionMessage}</p>}
      {score !== null && !isTestCompleted && <p>Score: {Math.round(score)}%</p>}
      {isTestCompleted && sharkFact && <p>Fun Fact: {sharkFact}</p>}
      <p>Current Points: {points}</p>
    </div>
  );
  
};

export default Exam;